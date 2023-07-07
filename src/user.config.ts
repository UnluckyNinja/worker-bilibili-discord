export const SETTINGS = {
  subscriptions: {
    '423895': {
      webhookKeys: [
        'WEBHOOK_FUTURETECH',
        'WEBHOOK_PRIVATE',
      ],
      roles: {
        WEBHOOK_FUTURETECH: ['1118733545897197589'],
        WEBHOOK_PRIVATE: ['709421435382267915'],
      },
      webhookOnError: { // TODO
        WEBHOOK_FUTURETECH: 'WEBHOOK_FUTURETECH_ERROR',
      }
    },
    // '123456': [],
  }, 
} as const