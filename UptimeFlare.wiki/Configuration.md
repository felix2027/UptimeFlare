All of UptimeFlare's configuration is done in the `uptime.config.ts` file, and after you create your own UptimeFlare repository from a template, you will need to modify the `uptime.config.ts` in your repository to define the monitoring and other configurations you need.

It is a typescript file, but when used as a configuration file, it is similar to JSON.

The `uptime.config.ts` file provided [in the template](https://github.com/lyc8503/UptimeFlare/blob/main/uptime.config.ts) is the latest complete configuration, usually, you don't need to use all the options, below I will explain some of the commonly used configurations and provide a simpler configuration as a reference.

### PageConfig

PageConfig is mainly s tatus page related configuration items, including the title of the status page, and the link in the upper right corner of the status page.

These configurations are literally just that, modify them as you see fit!

```typescript
const pageConfig = {
  title: "lyc8503's Status Page",
  links: [
    { link: 'https://github.com/lyc8503', label: 'GitHub' },
    { link: 'https://blog.lyc8503.site/', label: 'Blog' },
    { link: 'mailto:me@lyc8503.site', label: 'Email Me', highlight: true },
  ],
}
```

### WorkerConfig 

WorkerConfig is mainly used in the worker for monitoring, the main monitors are defined in the `monitors` array.

`notification` contains configuration related to sending notifications, if you need to be notified when the monitoring status changes, see [Setup notification](https://github.com/lyc8503/UptimeFlare/wiki/Setup-notification).

Normally you don't need to change `kvWriteCooldownMinutes` and `callbacks`, just leave them at their default values.

If you want to make your status page private (of course it's optional), you may set up a username and password by providing `passwordProtection`.

```typescript
const workerConfig = {
  kvWriteCooldownMinutes: 3,
  passwordProtection: 'username:password',
  monitors: [
    {
      id: 'foo_monitor',
      name: 'My API Monitor',
      method: 'GET',
      target: 'https://www.google.com'
    },
    {
      id: 'test_tcp_monitor',
      name: 'Example TCP Monitor',
      method: 'TCP_PING',
      target: '1.2.3.4:22'
    },
    // You can continue to define more monitors here...
  ],
  notification: {
    //...
  },
  callbacks: {
    //...
  },
}
```

The complete configuration for a single monitor is as follows, if you don't know what a field is for, don't include it!
```typescript
{
  // `id` should be unique, history will be kept if the `id` remains constant
  id: 'foo_monitor',
  // `name` is used at status page and callback message
  name: 'My API Monitor',
  // `method` should be a valid HTTP Method or "TCP_PING" for TCP port monitor
  method: 'POST',
  // `target` is a valid URL for HTTP or hostname:port for TCP
  target: 'https://example.com',
  // [OPTIONAL] `tooltip` is ONLY used at status page to show a tooltip
  tooltip: 'This is a tooltip for this monitor',
  // [OPTIONAL] `statusPageLink` is ONLY used for clickable link at status page
  statusPageLink: 'https://example.com',
  // [OPTIONAL] `expectedCodes` is an array of acceptable HTTP response codes, if not specified, default to 2xx
  expectedCodes: [200],
  // [OPTIONAL] `timeout` in millisecond, if not specified, default to 10000
  timeout: 10000,
  // [OPTIONAL] headers to be sent with HTTP monitor
  headers: {
    'User-Agent': 'Uptimeflare',
    Authorization: 'Bearer YOUR_TOKEN_HERE',
  },
  // [OPTIONAL] body to be sent with HTTP monitor
  body: 'Hello, world!',
  // [OPTIONAL] if specified, the HTTP response must contains the keyword to be considered as operational.
  responseKeyword: 'success',
  // [OPTIONAL] if specified, the check will run in your specified region,
  // refer to docs https://github.com/lyc8503/UptimeFlare/wiki/Geo-specific-checks-setup before setting this value
  checkLocationWorkerRoute: 'https://xxx.example.com',
},
```



### Complete config
```typescript
const pageConfig = {
  title: "lyc8503's Status Page",
  links: [
    { link: 'https://github.com/lyc8503', label: 'GitHub' },
    { link: 'mailto:me@lyc8503.site', label: 'Email Me', highlight: true },
  ],
}

const workerConfig = {
  kvWriteCooldownMinutes: 3,
  passwordProtection: 'username:password',
  monitors: [
    {
      id: 'google_monitor',
      name: 'My Google Monitor',
      method: 'GET',
      target: 'https://www.google.com'
    },
    {
      id: 'ssh_monitor',
      name: 'Example SSH Monitor',
      method: 'TCP_PING',
      target: '1.2.3.4:22'
    },
  ],
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string,
    ) => {
      // This callback will be called when there's a status change for any monitor
      // Write any Typescript code here

      // This will not follow the grace period settings and will be called immediately when the status changes
      // You need to handle the grace period manually if you want to implement it
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string,
    ) => {
      // This callback will be called EVERY 1 MINTUE if there's an on-going incident for any monitor
      // Write any Typescript code here
    },
  },
}

// Don't forget this, otherwise compilation fails.
export { pageConfig, workerConfig }
```
