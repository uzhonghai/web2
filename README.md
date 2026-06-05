# Web2 微前端项目

基于 **Vite + Module Federation** 的微前端 Monorepo，采用 Host 壳应用 + 远程子应用 + 共享模块的架构，支持子应用独立开发、独立部署与运行时按需加载。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19、TypeScript |
| 构建 | Vite 6、`@module-federation/vite` |
| UI | Ant Design 6、Tailwind CSS 4 |
| 路由 | React Router 6 |
| 请求 | Axios（统一封装于 `session` 共享模块） |

## 项目结构

```
web2/
├── host/                 # 壳应用（主入口）
│   ├── src/
│   │   ├── config/       # 远程应用配置、MF 注册逻辑
│   │   ├── remote/       # 远程模块加载器
│   │   ├── router/       # 路由与鉴权
│   │   └── components/   # 布局等公共组件
│   └── vite.config.ts
├── remote/
│   ├── login/            # 登录子应用（静态远程，启动时注册）
│   └── system/           # 系统管理子应用（动态远程）
└── share/
    └── session/          # 共享模块（请求封装、Session 管理）
```

### 模块职责

| 模块 | MF 名称 | 默认端口 | 说明 |
|------|---------|----------|------|
| `host` | `host_app` | 4173 | 主应用壳，负责路由、布局、子应用注册与加载 |
| `share/session` | `session` | 4172 | 暴露 `./request`，提供 Axios 实例、Token 注入、统一错误处理 |
| `remote/login` | `login` | 4174 | 暴露 `./Login`，登录页 |
| `remote/system` | `system` | 4175 | 暴露 `./system`，系统管理业务模块 |

## 架构说明

```
┌─────────────────────────────────────────────────────┐
│                      Host 壳应用                      │
│  ┌─────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Router │  │  AppLayout   │  │ RemoteLoader  │  │
│  └─────────┘  └──────────────┘  └───────────────┘  │
└──────────┬──────────────┬────────────────┬───────────┘
           │              │                │
     ┌─────▼─────┐  ┌─────▼─────┐   ┌─────▼─────┐
     │   login   │  │  system   │   │  session  │
     │  (静态)   │  │  (动态)   │   │  (共享)   │
     └───────────┘  └───────────┘   └───────────┘
```

- **静态远程**：`login` 在 Host 初始化时即注册，不依赖后端接口下发。
- **动态远程**：业务子应用（如 `system`）通过 `fetchRemoteApps()` 获取配置后，运行时调用 `registerRemotes` 按需加载。
- **共享模块**：`session` 在构建期固定注册，各子应用通过 `import ... from 'session/request'` 消费统一的请求层。
- **共享依赖**：`react`、`react-dom`、`react-router-dom`、`antd`、`axios` 均以 `singleton` 模式共享，避免多实例冲突。

## 环境要求

- **Node.js** >= 20.18.1
- 包管理器：npm / pnpm / yarn（各子包独立管理依赖）

## 快速开始

### 1. 安装依赖

在各子包目录下分别安装：

```bash
cd share/session && npm install
cd ../../remote/login && npm install
cd ../system && npm install
cd ../../host && npm install
```

### 2. 启动开发环境

微前端开发需要**同时启动所有模块**，建议开 4 个终端：

```bash
# 终端 1 — 共享模块（最先启动）
cd share/session && npm run dev

# 终端 2 — 登录子应用
cd remote/login && npm run dev

# 终端 3 — 系统管理子应用
cd remote/system && npm run dev

# 终端 4 — Host 壳应用
cd host && npm run dev
```

启动后访问：**http://localhost:4173**

### 3. 构建生产包

```bash
cd share/session && npm run build
cd ../../remote/login && npm run build
cd ../system && npm run build
cd ../../host && npm run build
```

构建产物位于各子包的 `dist/` 目录，需按部署方案将各模块静态资源部署到对应路径。

## 环境变量

各子包通过 `.env.development` / `.env.production` 管理配置，核心变量如下：

### Host (`host/.env.*`)

| 变量 | 说明 | 开发默认值 |
|------|------|-----------|
| `VITE_HOST_PORT` | 开发服务器端口 | `4173` |
| `VITE_HOST_ORIGIN` | 开发服务器 Origin | `http://localhost:4173` |
| `VITE_API_BASE_URL` | API 基础路径 | `/api` |
| `VITE_SESSION_ENTRY` | session 远程入口 | `http://localhost:4172/session.js` |
| `VITE_LOGIN_ENTRY` | login 远程入口 | `http://localhost:4174/login.js` |
| `VITE_SYSTEM_ENTRY` | system 远程入口 | `http://localhost:4175/system.js` |

### Session (`share/session/.env.*`)

| 变量 | 说明 | 开发默认值 |
|------|------|-----------|
| `VITE_SESSION_PORT` | 开发服务器端口 | `4172` |
| `VITE_SESSION_BASE` | 部署基础路径 | `/` |

### 子应用 (`remote/*/.env.*`)

| 变量 | 说明 |
|------|------|
| `VITE_*_PORT` | 各子应用开发端口 |
| `VITE_*_ORIGIN` | 各子应用 Origin |
| `VITE_SESSION_ENTRY` | session 远程入口地址 |

> 生产环境需将所有 `*_ENTRY` 指向实际部署的 `remoteEntry` URL。

## API 代理

开发环境下，各应用的 Vite 开发服务器将 `/api` 代理到后端：

```
/api → https://xmhis.top:30101
```

可在各子包的 `vite.config.ts` 中修改 `server.proxy` 配置。

## 新增子应用

1. 在 `remote/` 下创建新子应用，参考 `remote/system` 的 `vite.config.ts` 配置 Module Federation `exposes`。
2. 在 Host 的 `src/config/remoteApps.ts` 中添加子应用配置（或接入后端接口动态下发）。
3. 在 `host/.env.*` 中配置对应的 `VITE_<APP>_ENTRY` 环境变量。
4. 确保子应用依赖 `session` 远程模块以复用请求层。

子应用配置字段说明：

```ts
interface RemoteAppConfig {
  name: string;        // MF 远程容器名称
  entry: string;       // remoteEntry 完整 URL
  moduleId: string;    // 模块 ID，如 "system/system"
  routePath: string;   // 前端路由路径，如 "/system"
  menuLabel: string;   // 侧边栏菜单标题
  menuIcon: string;    // Ant Design 图标名称
  menuOrder: number;   // 菜单排序
}
```

## 鉴权流程

1. 用户访问受保护路由时，`RequireAuth` 检查 `sessionStorage` 中的 `session_id`。
2. 未登录则重定向至 `/login`，加载 `login/Login` 远程模块。
3. 登录成功后写入 `session_id`，`session/request` 自动在请求头中携带 `xmhis-session-id`。

## 常用脚本

各子包均提供以下 npm scripts：

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | TypeScript 编译 + 生产构建 |
| `npm run preview` | 预览生产构建产物 |

## 注意事项

- 开发时务必**先启动 `session`**，再启动其他子应用和 Host，否则远程模块加载会失败。
- 修改共享依赖版本时，需保持各子包 `package.json` 中版本一致，避免 MF `shared` 冲突。
- 生产部署需确保各远程入口（`*.js`）可被浏览器跨域访问，并正确配置 CORS 或同域部署。
- `fetchRemoteApps()` 当前使用 Mock 数据，接入真实后端后替换 `src/config/remoteApps.ts` 中的实现即可。

## 目录约定

- `host/src/config/` — 远程应用配置与 MF 注册
- `host/src/remote/` — 远程模块动态加载逻辑
- `share/session/src/request.ts` — 统一 HTTP 请求封装
- `remote/<app>/src/*App.tsx` — 各子应用 MF 暴露入口
