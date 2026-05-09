<p align="center">
  <img src="./public/favicon.ico" width="64" height="64" alt="NexusMC Docs" />
</p>

<h1 align="center">NexusMC 文档中心</h1>

<p align="center">
  基于 Astro + MDX 构建的静态文档站，支持纯前端搜索、多语言扩展与自定义主题。
</p>

<p align="center">
  <a href="https://github.com/NexusMC-CN/docs/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/NexusMC-CN/docs?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/NexusMC-CN/docs/stargazers">
    <img src="https://img.shields.io/github/stars/NexusMC-CN/docs?style=flat-square" alt="Stars" />
  </a>
  <a href="https://github.com/NexusMC-CN/docs/commits/main">
    <img src="https://img.shields.io/github/last-commit/NexusMC-CN/docs?style=flat-square" alt="Last Commit" />
  </a>
</p>

---

## ✨ 特性

- **纯静态构建** — 基于 Astro，零后端依赖，构建产物可直接部署到任何静态托管服务
- **纯前端搜索** — 构建时生成索引，无需 Elasticsearch 等外部服务
- **MDX 支持** — 文档使用 MDX 编写，支持 JSX 组件与 frontmatter
- **多语言就绪** — 目录结构预留 i18n 扩展，欢迎社区贡献翻译
- **主题可定制** — 基于 Tailwind CSS，变量化设计，易于换肤
- **任务导向导航** — "按目标阅读"设计，让用户快速找到所需内容

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/NexusMC-CN/docs.git
cd docs

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
# 产物位于 dist/ 目录
```

### 部署

构建产物为纯静态文件，可部署至：

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)
- 自有服务器 / CDN

## 📖 使用场景

### 1. 直接使用本项目

你可以 fork 本仓库，修改配置文件（站点名称、Logo、主站链接等），填入你自己的文档内容，快速搭建一个社区文档中心。

关键配置位置：
- `astro.config.mjs` — 站点基础配置
- `src/config.ts` — 主题与导航配置
- `public/` — 静态资源（Logo、Favicon 等）
- `src/content/docs/` — 文档内容（MDX）

### 2. 提交内容 PR

无论你是为 **NexusMC** 补充官方文档，还是改进本项目的功能与样式，我们都欢迎 Pull Request。

**内容 PR 请遵循：**
- 文档使用 MDX 格式，存放于 `src/content/docs/` 对应分类目录下
- 每篇文档 frontmatter 至少包含 `title` 和 `description`
- 配图请存放于 `public/images/` 并在文档中引用

### 3. 多语言贡献

我们欢迎社区贡献多语言翻译，让非中文用户也能使用本项目。

**多语言 PR 流程：**
1. 先开 Issue 说明计划翻译的语言，避免重复劳动
2. 在 `src/content/docs/` 下按语言代码建立目录（如 `en/`、`ja/`）
3. 保持与中文文档相同的目录结构
4. 在 frontmatter 中标注 `lang: en`
5. 提交 PR，标题格式：`[i18n] 添加 XXX 语言支持`

> 当前已支持语言：中文（zh）

## 🏗️ 技术栈

| 技术 | 用途 |
|------|------|
| [Astro](https://astro.build) | 静态站点生成 |
| [MDX](https://mdxjs.com) | 文档内容编写 |
| [Tailwind CSS](https://tailwindcss.com) | 样式与主题 |
| 纯前端索引 | 文档搜索（构建时生成） |

## 📂 项目结构

```
.
├── public/                 # 静态资源
├── src/
│   ├── components/         # 可复用组件
│   ├── content/
│   │   └── docs/           # 文档内容（MDX）
│   │       ├── 快速开始/
│   │       ├── 投稿流程/
│   │       ├── 主站信息/
│   │       ├── 资源规范/
│   │       └── API/
│   ├── layouts/            # 页面布局
│   ├── pages/              # 路由页面
│   └── config.ts           # 站点配置
├── astro.config.mjs        # Astro 配置
├── tailwind.config.mjs     # Tailwind 配置
└── package.json
```

## 🤝 贡献指南

1. **Fork** 本仓库
2. 创建你的特性分支：`git checkout -b feat/xxx`
3. 提交改动：`git commit -m "feat: xxx"`
4. 推送分支：`git push origin feat/xxx`
5. 发起 **Pull Request**

**提交规范：**
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `i18n:` 多语言相关
- `style:` 样式调整
- `refactor:` 代码重构

## 📄 许可证

本项目基于 [MIT](LICENSE) 协议开源。

你可以自由使用、修改、分发本项目的代码，包括用于商业用途，但请保留原始版权声明。

---

<p align="center">
  Made with ❤️ by <a href="https://nexusmc.cn">NexusMC</a>
</p>
