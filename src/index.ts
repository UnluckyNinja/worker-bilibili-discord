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
import { fetchMessageList, onScheduled } from './triggers';

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  KV: KVNamespace;
  DISCORD_WEBHOOK: string;
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
// 仅用于调试，数据敏感，生产环境务必删除或注释掉
  // async fetch(
  //   request: Request,
  //   env: Env,
  //   ctx: ExecutionContext
  // ): Promise<Response> {
  //   const router = Router();
  //   router
  //     .get('/__test_fetch', async () => Response.json(await fetchMessageList()))
  //     .get('/__test_env', async () => Response.json(env))
  //     .get('/__test_discord', async () => {
  //       const list = await fetchMessageList()
  //       await pushMessagesToDiscord(list, env.DISCORD_WEBHOOK, false)
  //       return new Response('Sent. ')
  //     })
  //   return router.handle(request)
  // },
};
