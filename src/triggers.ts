import { Env } from '.';
import { MessageAPIResult } from './bilibili_api';
import { pushMessagesToDiscord } from './messages';
import { SETTINGS } from './user.config';

let env: Env

type MessageInfoType = {
  type: 'DYNAMIC_TYPE_AV'
  title: string
  description: string
  length: string
  thumbnail: string
} | {
  type: 'DYNAMIC_TYPE_WORD'
  text: string
} | {
  type: 'DYNAMIC_TYPE_DRAW'
  text: string
  images: string[]
} | {
  type: 'DYNAMIC_TYPE_FORWARD'
  text: string
  originalName: string
  originalText: string
}

type MessageInfoBase = {
  id_str: string
  url: string
  timestamp: number
  author: {
    name: string
    url: string
    icon_url: string
  }
}

export type MessageInfo = MessageInfoBase & MessageInfoType

const MESSAGE_API = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space'

export async function fetchMessageList(userID: string): Promise<MessageInfo[]> {
  const target = new URL(MESSAGE_API)

  target.search = new URLSearchParams({
    offset: '',
    host_mid: userID, // SETTINGS.bilibili_id, // 在 src/user.config.ts 中修改
    timezone_offset: '',
  }).toString()

  const response = await fetch(target.toString(), {
    headers: {
      Accept: 'application/json',
      Cookie: `DedeUserID=${userID};`,
      Origin: 'space.bilibili.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43'
    },
    method: 'GET',
  })

  if (Math.floor(response.status / 100) !== 2) {
    throw `Bilibili server http error: ${response.statusText}`
  }

  const json = await response.json<MessageAPIResult>()

  if (json.code !== 0) {
    throw `Bilibili server api error: ${json.message}`
  }

  const list = json.data.items

  if (!list) throw 'Bilibili server returned empty message list'

  list.sort((a, b) => {
    // pub_ts 是unix时间戳，按降序排列，可以不受置顶影响，单位为秒，在Date中使用须 *1000
    return b.modules.module_author.pub_ts - a.modules.module_author.pub_ts
  })
  // 将json数据转换为简单的已定义数据
  const result = list.map<MessageInfo | null>(item => {
    const base: Omit<MessageInfoBase, 'url'> = {
      timestamp: item.modules.module_author.pub_ts,
      id_str: item.id_str,
      author: {
        name: item.modules.module_author.name,
        url: `https:${item.modules.module_author.jump_url}`,
        icon_url: item.modules.module_author.face,
      }
    }
    switch (item.type) {
      case 'DYNAMIC_TYPE_AV':
        return {
          type: 'DYNAMIC_TYPE_AV',
          title: item.modules.module_dynamic.major?.archive?.title ?? '',
          description: item.modules.module_dynamic.major?.archive?.desc ?? '',
          length: item.modules.module_dynamic.major?.archive?.duration_text ?? '',
          thumbnail: item.modules.module_dynamic.major?.archive?.cover ?? '',
          url: `https://www.bilibili.com/video/${item.modules.module_dynamic.major?.archive?.bvid}`,
          ...base,
        }
      case 'DYNAMIC_TYPE_WORD':
        return {
          type: 'DYNAMIC_TYPE_WORD',
          text: item.modules.module_dynamic.desc?.text ?? '',
          url: `https://t.bilibili.com/${item.id_str}`,
          ...base,
        }
      case 'DYNAMIC_TYPE_DRAW':
        return {
          type: 'DYNAMIC_TYPE_DRAW',
          text: item.modules.module_dynamic.desc?.text ?? '',
          images: item.modules.module_dynamic.major?.draw?.items?.map(it => it.src) ?? [],
          url: `https://t.bilibili.com/${item.id_str}`,
          ...base,
        }
      case 'DYNAMIC_TYPE_FORWARD':
        let originalName = item.orig?.modules.module_author.name ?? ''
        let originalText = ''
        if (item.orig?.type === 'DYNAMIC_TYPE_AV') {
          originalText = item.orig.modules.module_dynamic.major.archive?.title +
            ` https://www.bilibili.com/video/${item.orig.modules.module_dynamic.major?.archive?.bvid}`
        } else {
          originalText = item.orig?.modules.module_dynamic.desc?.text ?? ''
        }
        return {
          type: 'DYNAMIC_TYPE_FORWARD',
          text: item.modules.module_dynamic.desc?.text ?? '',
          url: `https://t.bilibili.com/${item.id_str}`,
          originalName,
          originalText,
          ...base,
        }
    }
    return null // 以防API修改出现了新的消息类型，忽略对应消息
  }).filter(it => it) as MessageInfo[]
  return result
}

export function filterNewMessages(list: MessageInfo[], last: MessageInfo[]): MessageInfo[] {
  const lastTime = last[0].timestamp
  const lastID = last[0].id_str
  // 如果哪天B博支持编辑消息了需要对应做出修改
  const filtered = list.filter(it => it.id_str !== lastID && it.timestamp > lastTime)
  return filtered
}

async function processSingleUser(userID: string, webhook: string, roles: readonly string[]){
  const KV_KEY = `feed_${userID}`
  const updateKV = async (list: MessageInfo[]) => {
    await env.FEED_CACHE.put(KV_KEY, JSON.stringify(list))
  }

  const list = await fetchMessageList(userID)
  const last = await env.FEED_CACHE.get<MessageInfo[]>(KV_KEY, 'json')
  if (!last) {
    // 若未有存储记录，则为首次运行，仅存储
    await updateKV(list)
    return
  }
  const latest = filterNewMessages(list, last)
  if (latest.length < 1) {
    // 无新消息
    return
  }
  await pushMessagesToDiscord(latest, webhook, roles ?? [])
  console.log(`Sent ${latest.length} new messages.`)
  await updateKV(list)
}

export async function onScheduled(_env: Env) {
  env = _env
  const subs = SETTINGS.subscriptions
  
  for (const [id, options] of Object.entries(subs)){
    for(let key of options.webhookKeys){
      const webhook = await env.WEBHOOKS.get(key)
      if(!webhook)
        continue
      await processSingleUser(id, webhook, options.roles[key])
    }
  }
}
