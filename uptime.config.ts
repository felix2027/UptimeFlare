const pageConfig = {
  // 状态页面的标题
  title: "felix's status",
  // 在状态页面的标题栏显示的链接，可以设置 `highlight` 为 `true` 进行高亮显示
  links: [
    { link: 'https://github.com/felix2027', label: 'GitHub' },
    { link: 'https://felix2027.github.io/', label: 'Blog' },
    { link: 'mailto:me@2002333.xyz', label: 'Email Me', highlight: true },
  ],
}
const workerConfig = {
  // 最短写入 KV（键值存储）的时间间隔，单位为分钟，除非状态发生变化，否则最多每 3 分钟写入一次
  kvWriteCooldownMinutes: 3,
  // 通过取消注释以下行启用 HTTP 基本认证，格式为 `<用户名>:<密码>`
  // passwordProtection: 'username:password',
  // 在此定义所有监测项
  monitors: [
    // 示例 HTTP 监测
    {
      // `id` 需要唯一，若 `id` 保持不变，则会保留历史记录
      id: 'foo_monitor',
      // `name` 在状态页面和回调消息中使用
      name: '我的 API 监测',
      // `method` 需为有效的 HTTP 方法
      method: 'POST',
      // `target` 需为有效的 URL
      target: 'https://example.com',
      // [可选] `tooltip` 仅用于状态页面，显示监测项的提示信息
      tooltip: '这是该监测项的提示信息',
      // [可选] `statusPageLink` 仅用于状态页面，使其可点击跳转
      statusPageLink: 'https://example.com',
      // [可选] `expectedCodes` 是一个可接受的 HTTP 响应状态码数组，若未指定，则默认接受 2xx 状态码
      expectedCodes: [200],
      // [可选] `timeout` 设定超时时间（毫秒），默认 10000
      timeout: 10000,
      // [可选] 发送的请求头
      headers: {
        'User-Agent': 'Uptimeflare',
        Authorization: 'Bearer YOUR_TOKEN_HERE',
      },
      // [可选] 发送的请求体
      body: 'Hello, world!',
      // [可选] 若指定，则返回的响应必须包含该关键字，才能认为是正常运行状态
      responseKeyword: 'success',
      // [可选] 若指定，则检查将在特定地区执行，
      // 设置前请参考文档 https://github.com/lyc8503/UptimeFlare/wiki/Geo-specific-checks-setup
      checkLocationWorkerRoute: 'https://xxx.example.com',
    },
    // 示例 TCP 监测
    {
      id: 'test_tcp_monitor',
      name: '示例 TCP 监测',
      // `method` 需为 `TCP_PING` 以进行 TCP 监测
      method: 'TCP_PING',
      // `target` 需为 `主机:端口` 格式
      target: '1.2.3.4:22',
      tooltip: '我的生产服务器 SSH',
      statusPageLink: 'https://example.com',
      timeout: 5000,
    },
  ],
  notification: {
    // [可选] Apprise API 服务器 URL
    // 若未指定，则不会发送通知
    appriseApiServer: "https://apprise.example.com/notify",
    // [可选] Apprise 的收件人 URL，参考 https://github.com/caronc/apprise
    // 若未指定，则不会发送通知
    recipientUrl: "tgram://bottoken/ChatID",
    // [可选] 用于通知消息的时区，默认为 "Etc/GMT"
    timeZone: "Asia/Shanghai",
    // [可选] 在发送通知前的宽限时间（分钟）
    // 只有当监测对象连续 N 次检查失败后，才会发送通知
    // 若未指定，则默认立即发送通知
    gracePeriod: 5,
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 当任何监测项的状态发生变化时，将调用此回调函数
      // 在此编写任意 TypeScript 代码

      // 该回调不会遵循宽限期设置，一旦状态发生变化，它将立即被调用
      // 如果需要实现宽限期机制，需要在此手动处理
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 若任何监测项发生故障，每 1 分钟调用一次该回调函数
      // 在此编写任意 TypeScript 代码
    },
  },
}

// 别忘了导出这些配置，否则编译会失败。
export { pageConfig, workerConfig }
