export interface HelpLink {
  label: string;
  href: string;
}

export interface HelpQuestion {
  id: string;
  question: string;
  answer: string[];
  steps?: string[];
  related?: HelpLink[];
}

export interface HelpCategory {
  slug: string;
  label: string;
  description: string;
  questions: HelpQuestion[];
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: 'account-login',
    label: '账号与登录',
    description: '处理登录、密码、邮箱、手机号和第三方账号绑定问题。',
    questions: [
      {
        id: 'forgot-password',
        question: '忘记密码怎么办？',
        answer: ['账号绑定了可用邮箱时，可以从登录页发起密码重置；邮件到达后按提示设置新密码。第三方登录账号如果仍能正常登录，也可以先进入账号设置补齐邮箱。'],
        steps: ['打开登录页并选择“忘记密码”。', '填写账号绑定邮箱并获取重置邮件。', '通过邮件中的一次性链接设置新密码。'],
        related: [{ label: '密码设置与无密码模式', href: '/docs/site-info/password-settings' }],
      },
      {
        id: 'change-username',
        question: '可以修改用户名吗？',
        answer: ['是否允许修改用户名由当前站点配置决定。账号设置中没有修改入口时，说明该能力暂未开放或需要管理员协助，频繁更名也可能受到时间限制。'],
      },
      {
        id: 'email-or-phone',
        question: '为什么需要绑定邮箱或手机号？',
        answer: ['邮箱和手机号用于账号找回、安全验证、重要通知与风险控制。具体操作只会要求满足对应的安全条件，不会因为绑定其中一项就自动公开联系方式。'],
        related: [
          { label: '邮箱设置', href: '/docs/site-info/email-settings' },
          { label: '手机号绑定', href: '/docs/site-info/phone-binding' },
        ],
      },
      {
        id: 'oauth-placeholder-email',
        question: '第三方登录后为什么还要补充邮箱？',
        answer: ['部分第三方登录只提供不可收信的占位邮箱。站点会要求补充真实邮箱，以便找回账号和接收安全通知；此时修改邮箱通常会直接验证新邮箱。'],
        related: [{ label: '账号绑定与第三方授权', href: '/docs/site-info/account-connections' }],
      },
      {
        id: 'removed-current-device',
        question: '移除登录设备后为什么自己也退出了？',
        answer: ['移除当前设备会立即终止当前登录会话，因此页面会回到登录状态。移除其他设备只会让对应设备的会话失效。'],
        related: [{ label: '登录设备管理', href: '/docs/site-info/login-device-management' }],
      },
    ],
  },
  {
    slug: 'account-security',
    label: '账号安全',
    description: '了解二步验证、通行密钥、二次密码和高风险操作限制。',
    questions: [
      {
        id: 'strong-auth-required',
        question: '为什么操作前要求绑定安全验证？',
        answer: ['正式发布、敏感设置和高风险操作可能要求账号先绑定二步验证、通行密钥或双层密码中的一种。页面会显示当前缺少的条件。'],
        related: [{ label: '安全前置条件', href: '/docs/site-info/security-prerequisites' }],
      },
      {
        id: 'lost-backup-codes',
        question: '2FA 备用码找不到了怎么办？',
        answer: ['备用码只在生成或重置时完整展示。仍能完成二步验证时，可以进入安全设置重新生成；已经无法验证时，需要通过账号恢复流程联系管理员。'],
        related: [{ label: '二步验证（2FA）', href: '/docs/site-info/two-factor-auth' }],
      },
      {
        id: 'passwordless-requirement',
        question: '为什么删除密码前要先绑定通行密钥？',
        answer: ['无密码模式必须保留至少一种可用登录方式。先绑定通行密钥，可以避免删除密码后账号完全无法登录。'],
        related: [{ label: '通行密钥', href: '/docs/site-info/passkeys' }],
      },
      {
        id: 'secondary-password',
        question: '双层密码和登录密码有什么区别？',
        answer: ['登录密码用于进入账号；双层密码也叫二次密码，用于登录后再次确认高风险操作。两者用途不同，也不建议设置成相同内容。'],
        related: [{ label: '双层密码（二次密码）', href: '/docs/site-info/double-password' }],
      },
    ],
  },
  {
    slug: 'submission-review',
    label: '投稿与审核',
    description: '解释投稿资格、草稿、审核状态、退回修改和再次审核。',
    questions: [
      {
        id: 'why-review',
        question: '为什么我的内容需要审核？',
        answer: ['帖子、资源、找服玩服务器和视频投稿可能进入审核队列。审核会检查分类、内容完整性、链接安全性、授权情况以及是否存在违规信息。'],
      },
      {
        id: 'draft-pending',
        question: '草稿、待审核和已发布有什么区别？',
        answer: ['草稿通常仅作者可见；待审核表示已提交但尚未公开；审核通过后内容才会进入公开列表。审核未通过时，需要按退回原因修改后重新提交。'],
      },
      {
        id: 'review-after-edit',
        question: '已发布内容编辑后为什么再次进入审核？',
        answer: ['修改标题、正文、分类、封面、下载链接或视频地址等关键字段时，系统可能重新检查内容。普通统计变化不会触发再次审核。'],
      },
      {
        id: 'creator-access',
        question: '为什么我还不能投稿？',
        answer: ['请依次检查账号等级、开发者考试、创作者协议和安全前置条件。页面会按当前缺少的条件给出提示，全部满足后才会开放正式提交。'],
        related: [
          { label: '考试中心', href: '/docs/site-info/exam-center' },
          { label: '创作者开通与协议确认', href: '/docs/site-info/creator-onboarding' },
        ],
      },
    ],
  },
  {
    slug: 'content-interaction',
    label: '内容与互动',
    description: '处理内容可见性、评论、收藏、删除和正文格式问题。',
    questions: [
      {
        id: 'content-not-visible',
        question: '为什么看不到某篇帖子或资源？',
        answer: ['内容可能仍是草稿、正在审核、已被隐藏，或者设置了访问限制。公开搜索也只会返回当前用户有权限查看的内容。'],
      },
      {
        id: 'likes-public',
        question: '点赞、收藏和评论会公开吗？',
        answer: ['评论和回复通常属于公开互动；点赞与收藏的展示范围取决于具体页面和隐私设置。自己的收藏列表不会因为收藏动作自动变成公开内容。'],
      },
      {
        id: 'delete-content',
        question: '为什么不能直接删除自己的内容？',
        answer: ['部分内容为了保留审核、讨论或安全记录，只允许改为草稿、停止公开或提交删除申请。页面提供删除按钮时，才代表该内容允许作者直接删除。'],
      },
      {
        id: 'forum-format',
        question: '帖子正文支持哪些格式？',
        answer: ['论坛正文以 Markdown 为主，并兼容一部分常用 BBCode。迁移旧论坛内容后应先预览，确认图片、引用、链接和代码块显示正常。'],
        related: [{ label: '论坛正文语法支持', href: '/docs/site-info/forum-markdown-bbcode' }],
      },
    ],
  },
  {
    slug: 'messages-notifications',
    label: '消息与通知',
    description: '了解私信、群聊、通知、消息编辑、撤回和机器人消息。',
    questions: [
      {
        id: 'message-vs-notification',
        question: '私信、群聊和通知有什么区别？',
        answer: ['私信和群聊是会话中的实际消息；通知是点赞、回复、审核结果、提及或新消息等站内提醒。清除通知不会删除聊天记录。'],
      },
      {
        id: 'edit-message',
        question: '发送后的消息还能修改吗？',
        answer: ['可以。用户可以在消息发出后的 2 分钟内编辑自己的私信或群聊消息，超过时间后将不再提供编辑操作。'],
      },
      {
        id: 'recall-message',
        question: '消息可以撤回多久？',
        answer: ['用户可以在发送后的 3 分钟内撤回自己的私信或群聊消息。仅自己删除不会影响其他会话成员看到原消息。'],
      },
      {
        id: 'bot-buttons',
        question: '为什么有些消息带有操作按钮？',
        answer: ['互动按钮是机器人专用消息能力，普通用户不能发送。每行最多显示 3 个操作按钮，点击后会把对应操作返回给机器人处理。'],
      },
      {
        id: 'notifications-missing',
        question: '为什么收不到站内通知？',
        answer: ['请检查通知开关、邮箱验证和浏览器推送权限，并确认相关事件确实会触发通知。站内通知关闭不会阻止私信本身出现在消息中心。'],
        related: [{ label: '通知中心说明', href: '/docs/site-info/notifications-center' }],
      },
    ],
  },
  {
    slug: 'search-statistics',
    label: '搜索与统计',
    description: '说明搜索范围、排行榜口径、首页统计和服务器在线状态。',
    questions: [
      {
        id: 'search-incomplete',
        question: '为什么搜索结果不完整？',
        answer: ['全站搜索只返回当前用户可以访问的公开资源、帖子、找服玩和视频。草稿、待审核、隐藏、私密和受限内容不会出现在公开结果中。'],
      },
      {
        id: 'statistics-delay',
        question: '首页统计为什么有延迟？',
        answer: ['公开统计会使用缓存，不保证每次内容变化后立即刷新。短时间内的数量差异通常会在下一次缓存更新后恢复。'],
        related: [{ label: '站点信息统计', href: '/docs/site-info/site-statistics' }],
      },
      {
        id: 'ranking-changes',
        question: '排行榜名次为什么发生变化？',
        answer: ['排行榜会按当前榜单周期、公开内容状态和对应指标重新计算。内容被隐藏、统计去重或周期切换时，名次与数值都可能变化。'],
      },
      {
        id: 'server-status-delay',
        question: '找服玩在线状态为什么和游戏里不一致？',
        answer: ['在线状态来自定时探测，服务器刚启动、关闭或网络波动时可能出现短暂延迟。持续异常时应检查服务器地址、端口和外网可访问性。'],
      },
    ],
  },
  {
    slug: 'reports-appeals',
    label: '举报与申诉',
    description: '说明违规举报、私信举报、封禁申诉和证据准备。',
    questions: [
      {
        id: 'report-content',
        question: '发现违规内容应该怎么处理？',
        answer: ['优先使用内容页面提供的举报入口，选择最接近的原因并补充说明。不要在评论区继续争吵或扩散违规内容。'],
      },
      {
        id: 'report-message',
        question: '私信或群聊消息可以举报吗？',
        answer: ['存在骚扰、诈骗、广告导流、恶意链接或其他违规内容时，可以从消息操作中提交举报。举报会保留必要的消息与会话上下文供管理员核查。'],
      },
      {
        id: 'ban-appeal',
        question: '账号被封禁后如何申诉？',
        answer: ['先查看站内提示或通知中的处理原因，再通过站点提供的申诉渠道提交账号、处理时间、涉及内容和你的说明。重复提交相同申诉不会加快处理。'],
      },
      {
        id: 'appeal-evidence',
        question: '举报或申诉需要准备哪些信息？',
        answer: ['建议提供相关页面链接、消息时间、截图、完整经过和能够核实问题的其他信息。请隐藏与问题无关的密码、令牌或个人敏感信息。'],
      },
    ],
  },
  {
    slug: 'developer-access',
    label: '开发者接入',
    description: '处理个人 API、站点 API、OAuth、WebSocket 和机器人接入问题。',
    questions: [
      {
        id: 'personal-or-site-api',
        question: '个人 API 和站点 API 有什么区别？',
        answer: ['个人 API 用于用户自己的投稿与自动化操作；站点 API 面向官网、机器人和经过审核的第三方应用，提供公开内容查询等更稳定的对外契约。'],
      },
      {
        id: 'api-not-open',
        question: '为什么 API Token 功能还没有开放？',
        answer: ['个人 API、站点 API 和 OAuth 应用有不同的资格与审核要求。请根据页面提示检查认证、用户等级、开发者考试和管理员审核状态。'],
        related: [{ label: '个人 API Token 开放条件', href: '/docs/site-info/api-token-access' }],
      },
      {
        id: 'oauth-required',
        question: '哪些接口必须通过 OAuth 获取用户授权？',
        answer: ['需要读取当前用户身份、资料、授权范围或执行用户相关操作的接口必须使用 OAuth。仅查询公开内容的接口通常可以使用获批的站点 API Token。'],
        related: [{ label: '站点 API OAuth 用户身份', href: '/docs/api/site-api-oauth-user' }],
      },
      {
        id: 'websocket-use',
        question: '什么时候应该使用 WebSocket？',
        answer: ['需要即时接收聊天、通知、内容变化、找服玩在线状态或机器人提及事件时使用 WebSocket；普通详情查询和批量读取仍应使用 HTTP API。'],
        related: [{ label: 'WebSocket 与机器人', href: '/docs/api/realtime-websocket' }],
      },
    ],
  },
];

export const DEFAULT_HELP_CATEGORY = HELP_CATEGORIES[0];

export function getHelpCategory(slug: string) {
  return HELP_CATEGORIES.find((category) => category.slug === slug);
}
