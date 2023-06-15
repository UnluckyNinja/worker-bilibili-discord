/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

import { Router } from 'itty-router';
import { pushMessagesToDiscord } from './messages';
import { fetchMessageList, MessageInfo, onScheduled } from './triggers';

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  KV: KVNamespace;
  TOKEN: string;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(onScheduled(env))
  },

  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const { TOKEN } = env
    // 若服务器未设定token则关闭调试功能
    if (!TOKEN) return new Response('Token not set. Server functions is disabled.');

    const router = Router({ base: `/${TOKEN}` });
    
    // 调试功能
    router
      .get('/__test_fetch/:id', async ({params}) => Response.json(await fetchMessageList(params!.id)))
      // .get('/__test_env', async () => Response.json(env)) // 仅用于调试，数据敏感，生产环境务必删除或注释掉
      .get('/__test_kv/:id', async ({params}) => {
        const list = JSON.stringify(await fetchMessageList(params!.id))
        await env.KV.put('feed_test', list)
        const value = await env.KV.get<MessageInfo[]>('feed_test', 'json')
        return Response.json(list+'\n'+value)
      })
      .get('/__test_discord/:id', async ({params, query}) => {
        const list = await fetchMessageList(params!.id)
        const webhook_kv = query?.webhook_kv
        if(!webhook_kv) return new Response('You need to add webhook KV Key to queries.')
        const webhook = await env.KV.get(webhook_kv)
        if(!webhook) return new Response('You need to set a webhook url for this key in KV.')
        await pushMessagesToDiscord(list, webhook, [])
        return new Response('Sent. ')
      })
    return router.handle(request)
  },
}
