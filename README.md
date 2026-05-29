# Module Federation 2.0 + Vite + Ant Design 微前端 Demo

## 项目目录结构

```text
micro-frontend-demo/
├── .nvmrc
├── deploy/
│   └── nginx.conf.example
├── host/                                # 主应用 Host
│   ├── .env.development
│   ├── .env.production.example
│   ├── src/
│   │   ├── App.tsx
│   │   ├── remote-types.d.ts
│   │   ├── components/
│   │   │   ├── AppLayout.tsx
│   │   │   └── RemoteModuleLoader.tsx
│   │   ├── pages/
│   │   │   ├── CrossRemoteSharingDemo.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── RemoteAppDemo.tsx
│   │   │   ├── RemoteButtonDemo.tsx
│   │   │   └── RemoteUserList.tsx
│   │   └── utils/
│   │       ├── createRemotePage.tsx
│   │       └── eventBus.ts
│   ├── package.json
│   └── vite.config.ts
├── remote/                              # Remote A
│   ├── .env.development
│   ├── .env.production.example
│   ├── src/
│   │   ├── App.tsx
│   │   ├── RemoteApp.tsx
│   │   ├── components/
│   │   │   └── SharedButton.tsx
│   │   ├── pages/
│   │   │   └── UserList.tsx
│   │   └── utils/
│   │       └── eventBus.ts
│   ├── package.json
│   └── vite.config.ts
├── remote-b/                            # Remote B
│   ├── .env.development
│   ├── .env.production.example
│   ├── src/
│   │   ├── App.tsx
│   │   ├── remote-types.d.ts
│   │   ├── components/
│   │   │   └── RemoteBInfoCard.tsx
│   │   ├── pages/
│   │   │   └── CrossRemotePage.tsx
│   │   └── utils/
│   │       └── eventBus.ts
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 启动步骤

> 运行前请先切到 Node 20.18.1 或更高版本，项目根目录已提供 `.nvmrc`。

### 1. 安装依赖

```bash
cd micro-frontend-demo
nvm use

cd micro-frontend-demo/remote
npm install

cd ../remote-b
npm install

cd ../host
npm install
```

### 2. 启动顺序

先启动 Remote A，再启动 Remote B，最后启动 Host。

```bash
# 终端 1
cd micro-frontend-demo/remote
npm run dev

# 终端 2
cd micro-frontend-demo/remote-b
npm run dev

# 终端 3
cd micro-frontend-demo/host
npm run dev
```

### 3. 访问地址

| 应用 | 地址 | 说明 |
| ------ | ------ | ------ |
| Host | `http://localhost:4173` | 主应用入口 |
| Remote A | `http://localhost:4174` | 提供 `RemoteApp`、`UserList`、`SharedButton` |
| Remote B | `http://localhost:4175` | 动态消费 `Remote A/UserList` |

## 生产环境打包与部署

### 1. 环境变量

项目已经改成通过环境变量驱动远程入口和部署路径。

开发环境默认文件：

- `host/.env.development`
- `remote/.env.development`
- `remote-b/.env.development`

生产环境示例文件：

- `host/.env.production.example`
- `remote/.env.production.example`
- `remote-b/.env.production.example`

部署前请将它们复制为 `.env.production` 后再按你的真实域名修改。

例如：

```bash
cp host/.env.production.example host/.env.production
cp remote/.env.production.example remote/.env.production
cp remote-b/.env.production.example remote-b/.env.production
```

推荐同域不同路径部署：

- Host: `https://app.example.com/`
- Remote A: `https://app.example.com/mf/remote-a/`
- Remote B: `https://app.example.com/mf/remote-b/`

### 2. 生产打包

```bash
cd micro-frontend-demo/remote
npm ci
npm run build

cd ../remote-b
npm ci
npm run build

cd ../host
npm ci
npm run build
```

### 3. 发布顺序

建议始终按下面顺序发版：

1. Remote A
2. Remote B
3. Host

因为当前依赖链为：

- Host -> Remote A
- Host -> Remote B
- Remote B -> Remote A/UserList

### 4. 静态资源部署

三个应用的产物都在各自的 `dist/` 目录中：

- `remote/dist`
- `remote-b/dist`
- `host/dist`

可以部署到：

- Nginx
- OSS / S3 + CDN
- Vercel / Netlify
- 任意静态文件服务器

项目已附带 Nginx 示例配置：

- `deploy/nginx.conf.example`

### 5. 缓存策略

推荐缓存规则：

- `remoteEntry.js`：`no-cache`
- 带 hash 的 `assets/*.js` / `assets/*.css`：`immutable`

原因：

- `remoteEntry.js` 是联邦入口索引，需要尽快拿到新版本
- 带 hash 的静态资源适合长期缓存

### 6. SPA 路由回退

Host 使用 `BrowserRouter`，生产环境必须保证：

```text
非静态资源请求 -> 回退到 host/index.html
```

否则刷新像 `/cross-remote-sharing` 这类路径时会出现 404。

## 功能演示

1. `整应用展示`
   Host 直接加载 `remote_app/RemoteApp`，展示整个 Remote A 应用壳。

2. `用户管理`
   Host 只加载 `remote_app/UserList` 页面组件。

3. `远程组件`
   Host 只加载 `remote_app/SharedButton` 公共组件。

4. `跨子应用共享`
   Host 加载 `remote_b/CrossRemotePage`，而该页面内部会继续动态加载
   `remote_app/UserList`。这就是 **Remote B 消费 Remote A 指定业务组件** 的效果。

## 子应用组件共享机制

### 目标

- Remote A 暴露业务组件 `UserList`
- Remote B 动态消费 `remote_app/UserList`
- 只共享指定业务组件，不共享整个 Remote A 应用

### Remote A 暴露业务组件

在 `remote/vite.config.ts` 中：

```ts
exposes: {
  './RemoteApp': './src/RemoteApp.tsx',
  './UserList': './src/pages/UserList.tsx',
  './SharedButton': './src/components/SharedButton.tsx',
}
```

这里 `UserList` 是一个可被其他应用按需消费的业务组件入口。

### Remote B 消费 Remote A 的业务组件

在 `remote-b/vite.config.ts` 中：

```ts
remotes: {
  remote_app: {
    type: 'module',
    name: 'remote_app',
    entry: 'http://localhost:4174/remoteEntry.js',
    entryGlobalName: 'remote_app',
    shareScope: 'default',
  },
}
```

然后在 `remote-b/src/pages/CrossRemotePage.tsx` 里：

```ts
const RemoteAUserList = React.lazy(() => import('remote_app/UserList'));
```

Remote B 页面内部会把这个远程组件当成本地 React 组件来渲染。

## 远程组件加载流程

以 `Remote B -> Remote A/UserList` 为例：

1. 用户访问 Host 的 `跨子应用共享` 页面。
2. Host 先加载 `remote_b/CrossRemotePage`。
3. `CrossRemotePage` 渲染时，触发 `import('remote_app/UserList')`。
4. Module Federation 运行时根据 `remote_app` 的 `remoteEntry.js` 找到 `UserList` 模块。
5. 运行时检查共享依赖（`react`、`react-dom`、`antd` 等）是否已存在。
6. 若共享依赖已存在，则直接复用；否则按协商结果加载。
7. `UserList` 组件被下载、初始化并挂载到 Remote B 页面中。

这条链路说明：

- Host 不需要知道 Remote B 页面内部到底用了哪些来自 Remote A 的组件
- Remote B 可以像组装本地业务模块一样组装其他 Remote 的指定组件

## 如何避免循环依赖问题

跨子应用共享时，最常见风险是：

- Remote A 依赖 Remote B 的组件
- Remote B 又依赖 Remote A 的组件

这样会形成双向联邦依赖，导致初始化顺序复杂、运行时加载不稳定，甚至出现死循环。

### 推荐规避方式

1. **保持单向依赖**
   例如本示例中只允许 `Remote B -> Remote A/UserList`，不要再让
   `Remote A` 回头消费 `Remote B` 的模块。

2. **共享最小单元**
   只暴露业务组件或纯展示组件，比如 `UserList`，不要轻易暴露整个应用壳。

3. **抽取公共基础组件到独立 Remote 或共享包**
   如果 A、B 都需要同一类能力，优先抽成第三方共享层，而不是相互引用。

4. **避免业务回调链反向穿透**
   远程组件的交互建议通过 `props`、事件总线、接口数据来通信，不要让
   `Remote A` 为了回调又去反向 import `Remote B`。

## 共享依赖机制

本项目将这些依赖都声明为 `shared`：

- `react`
- `react-dom`
- `react-router-dom`
- `antd`

作用是：

1. 避免多个子应用重复打包相同依赖
2. 避免多个 React 实例导致 Hooks / Context 异常
3. 让跨子应用组件渲染时保持同一套运行时环境

## 数据通信

- `Props`
  Host -> Remote、Remote B -> Remote A 都可以通过 props 传值。

- `EventBus`
  本项目通过挂载到 `window` 的全局事件总线做事件通知，比如：
  `remote:button-click`、`remote:send-message`、`remote-b:component-shared`。

## 当前生产优化已落地

本项目已完成这些生产优化：

1. `host` / `remote` / `remote-b` 的联邦入口地址全部改为环境变量驱动
2. 三个应用均支持通过 `VITE_*_BASE` 配置子路径部署
3. 三个应用均增加 `engines.node >= 20.18.1`
4. 根目录增加 `.nvmrc`
5. 增加 `deploy/nginx.conf.example`
