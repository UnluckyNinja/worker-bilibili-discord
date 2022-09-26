# Worker-Bilibili-Discord

部署在Cloudflare上，定时抓取B站动态并推送到Discord中

## 安装

确保你已经安装了node环境以及npm等包管理器

克隆本项目到本地，打开命令行，输入 
```bash
npm i
```

## 使用
### 自定义
首先需要登录到 cloudflare
```bash
npx wrangler login
```

然后修改`wrangler.toml`中的name为你想要的名称，会显示在Cloudflare的Dashboard中。并把KV namespace ID为你自己的，直接去Dashboard创建即可，preview_id 为 dev 模式下使用可删除

再到`src/user.config.ts`中修改为你自己想要的配置：

- `bilibili_id` 是修改所要爬取的B站用户ID，例如 https://space.bilibili.com/123456 末尾的数字 123456

- `roles` 是推送到discord时想要at的角色ID数组，在discord客户端设置中开启开发者模式（设置->高级->开发者模式），再打开角色组管理列表，点击三个点按钮，复制ID

### 创建Webhook
打开任一文字频道的设置，选择集成/Integrations -> Webhooks -> New Webhook，自行设置头像名称和频道，然后点击复制Webhook URL

如果你想发到多个频道，就到对应频道一一创建Webhook，然后用`,`连接起来，不要包含空格或换行

打开命令行，输入
```bash
npx wrangler secret put DISCORD_WEBHOOK

# 等待弹出提示，粘贴并回车

npx wrangler publish
```

大功告成，坐等第一时间收到更新提醒吧

## 注意
Worker KV的免费tier quota是读取10万次每日，写入1000次每日，最多有3个cron trigger，帐号下所有项目共享