import { EmbedObject, WebhookPayload } from './discord';
import { MessageInfo } from './triggers';

// https://birdie0.github.io/discord-webhooks-guide/structure/embeds.html
export function buildMessage(message: MessageInfo): EmbedObject {
  const base = {
    color: 44780,
    url: message.url,
    author: {
      name: message.author.name,
      url: message.author.url,
      icon_url: message.author.icon_url,
    },
    footer: {
      text: 'Bilibili',
      // icon_url: 'https://www.bilibili.com/favicon.ico', // Discord 不支持ico，等哪天B站官方有brandkit了吧
    },
    timestamp: new Date(message.timestamp * 1000).toISOString()
  }
  // 视频投稿
  if (message.type === 'DYNAMIC_TYPE_AV'){
    return {
      title: message.title,
      thumbnail: {
        url: message.thumbnail,
      },
      // message.description 为空时不增加空行分隔
      description: (message.description ? message.description + '\n\n' : '') + message.url,
      ...base,
    }
  }
  const additionals: Partial<EmbedObject> = {
    description: message.text + '\n\n' + message.url,
  }
  if (message.type === 'DYNAMIC_TYPE_FORWARD'){
    additionals.fields = [{
      name: message.originalName,
      value: message.originalText,
    }]
  }
  if (message.type === 'DYNAMIC_TYPE_DRAW' && message.images.length > 0){
    additionals.image = {
      url: message.images[0],
    }
    if (message.images.length > 1){
      additionals.fields = [{
        name: `以及其余${message.images.length - 1}张图片`,
        value: message.url,
      }]
    }
  }
  return {
    ...base,
    ...additionals,
  }
}

// https://discord.com/developers/docs/resources/webhook#execute-webhook
export async function pushMessagesToDiscord(messages: MessageInfo[], webhooks: string, atRoles: readonly string[] = []) {
  const list = webhooks.split(',')
  const embeds = messages.slice(0, 10).map(it=> buildMessage(it)).reverse() // Discord消息时间序是下为新
  const payload: WebhookPayload = {
    embeds,
    allowed_mentions: {
      parse: []
    }
  }

  if (atRoles && atRoles.length > 0) {
    payload.content = atRoles.map(it=>`<@&${it}>`).join('')
    payload.allowed_mentions = {
      parse: ['roles']
    }
  }

  if(messages.length > 10){
    payload.content = (payload.content ? payload.content + '，' : '' ) +
      `以及${messages.length - 10}条稍早的消息因超出最大内容限制被省略`
  }

  for (let i = 0; i < list.length; i++){
    const response = await fetch(list[i], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      console.error(`Post to webhook ${i} failed. `, response.status, await response.json())
    }
  }
}
