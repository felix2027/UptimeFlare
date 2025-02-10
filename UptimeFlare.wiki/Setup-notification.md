## Apprise

Currently, UptimeFlare uses [Apprise](https://github.com/caronc/apprise) to send notifications and supports 100+ notification channels.

However, the apprise library is written in Python, and Cloudflare's recently released python worker [still has problems deploying apprise](https://github.com/lyc8503/apprise_vercel/issues/1#issuecomment-2123283890). So we are using Vercel serverless deployment for now and this part may change in the future. You can also use the [Apprise API](https://github.com/caronc/apprise-api) deployed by your own.

To setup:

1. Click the button below to deploy apprise on your Vercel account.  
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flyc8503%2Fapprise_vercel)

2. After deploying, you will get a link like `https://testapprise-lyc8503s-projects.vercel.app/`, appending `/notify` to it, and you get the link to the Apprise API server: https://testapprise-lyc8503s-projects.vercel.app/notify

3. Write the URL for sending notifications according to the [Apprise wiki](https://github.com/caronc/apprise/wiki), which has detailed documentation and instructions on how to set up each notification channel.
   e.g. For telegram, your URL is `tgram://botToken/chatId`

4. Fill in the `workerConfig.notification` configuration:
```typescript
notification: {
  appriseApiServer: "https://testapprise-lyc8503s-projects.vercel.app/notify",
  recipientUrl: "tgram://botToken/chatId",
  // [Optional] timezone used in notification messages, default to "Etc/GMT"
  timeZone: "Asia/Shanghai",
  // [Optional] grace period in minutes before sending a notification
  // notification will be sent only if the monitor is down for N continuous checks after the initial failure
  // if not specified, notification will be sent immediately
  gracePeriod: 5,
},
```

## Custom webhook [Only for javascript developers, advanced]

If you know the javascript language, you can use the `fetch` API in `workerConfig.callbacks` to request the webhook you need without deploying the apprise service.

WARNING: Prolonged blocking in callbacks can cause the entire monitoring to become abnormal. If you don't know how to debug this situation, don't modify the callbacks, use the apprise method above.