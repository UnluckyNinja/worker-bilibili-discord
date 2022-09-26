export type EmbedObject = {
  title?: string
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: {
    text: string
    icon_url?: string
  }
  image?: {
    url: string
  }
  thumbnail?: {
    url: string
  }
  author?: {
    name: string
    url?: string
    icon_url?: string
  }
  fields?: {
    name: string
    value: string
    inline?: boolean
  }[]
}

export type WebhookPayload = {
  content?: string
  username?: string
  avatar_url?: string
  tts?: boolean
  embeds?: EmbedObject[]
  allowed_mentions?: {
    parse?: ('roles' | 'users' | 'everyone')[]
    roles?: string[]
    users?: string[]
  }
}
