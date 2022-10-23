# Worker-Bilibili-Discord

部署在Cloudflare Worker上，定时抓取特定用户的B站动态并推送到Discord中

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

然后修改`wrangler.toml`中的`name`，作为Cloudflare控制台中的项目名。
接着修改`[[kv_namespaces]]`中的`id`，直接去Cloudflare的控制台创建KV空间即可，创建后复制id并粘贴，此处preview_id 为本地 dev 模式下使用，如果不准备自己调试代码可直接删除

如果不要求每分钟爬取，可修改`crons`为想要的模式，例如`"*/15 * * * *"`，是15分钟一次，详细设置请查阅官方文档

再到`src/user.config.ts`中修改为你自己想要的配置：
```javascript
export const SETTINGS = {
  subscriptions: {
    '423895': ['709421435382267915'],
    // '123465': ['709421435382215123','709421435382126343'], //可以添加多个订阅用户和at角色
    // '456789': [], //如果不需要at，可设置为空数组
  }, 
}
```
其中：
- `423895` 可以修改为所要爬取的B站用户ID，例如 https://space.bilibili.com/123456 末尾的数字 123456

- `['709421435382267915']` 是推送到discord时想要at的角色ID数组，在discord客户端设置中开启开发者模式（设置->高级->开发者模式），再打开角色组管理列表，点击三个点按钮，复制ID

### 创建Webhook
打开Discord中任一文字频道的设置，选择集成/Integrations -> Webhooks -> New Webhook，自行设置头像名称和频道，然后点击复制Webhook URL

如果你想发到多个频道，就到对应频道一一创建Webhook，然后把所有对应URL用`,`连接起来，不要包含空格或换行，复制到剪贴板，等下要用

打开命令行，输入
```bash
npx wrangler secret put DISCORD_WEBHOOK

# 等待弹出提示，粘贴（视终端软件不同，一般情况下是鼠标右键粘贴）并回车

npx wrangler publish
```
### 添加调试 Token
若想启用调试功能，需要设置Token，与DISCORD_WEBHOOK相同属于环境变量，作为URL路由参数，
可以是符合条件的任意字符串，建议使用sha256sum一类hash功能，生产随机字符串，复制

打开命令行，输入
```bash
npx wrangler secret put TOKEN

# 等待弹出提示，粘贴（视终端软件不同，一般情况下是鼠标右键粘贴）并回车

npx wrangler publish
```


大功告成，坐等第一时间收到更新提醒吧

## 部署后调试

- `/:TOKEN/__test_fetch/:id`: TOKEN为上文设置的环境变量，id是用户ID

## 注意
Worker KV的免费tier quota是读取10万次每日，写入1000次每日，最多有3个cron trigger，帐号下所有项目共享