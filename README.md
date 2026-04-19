# FocusFlow Study Planner 项目说明

## 项目访问地址

线上演示链接：[https://focusflow-study-planner.vercel.app](https://focusflow-study-planner.vercel.app)

## 项目简介

本项目是我为 Mobile and Web Development Post Project 完成的 Web 应用开发项目。项目名称为 FocusFlow Study Planner，主要面向需要管理课程作业、阅读任务和项目进度的学生用户。

在最初设计时，我考虑做一个普通的待办事项应用。但在进一步分析用户需求后，我发现很多学生在时间管理中真正困难的地方不是“不知道有什么任务”，而是任务太多时容易产生压力，导致迟迟无法开始。因此，我将项目方向调整为一个更适合 ADHD 特质或注意力容易分散用户使用的低阻力时间管理系统。

FocusFlow 的核心思路是：帮助用户快速记录任务，把大任务拆成一个可以马上开始的“最小下一步”，然后通过“现在开始”按钮直接进入倒计时专注页面。这样可以减少用户在开始任务前的犹豫和切换成本。

## 主要功能

- 添加学习任务，包括任务名称、课程或项目、截止日期、最小下一步和预计专注时间。
- 根据任务标题自动建议“最小下一步”，用户可以直接采用或自行修改。
- 提供写论文、做展示、读文献、复习考试和写代码等任务模板，减少空白表单带来的启动压力。
- 设置“今日聚焦”任务，让用户每天只关注少量重要任务。
- 点击“现在开始”后进入全屏倒计时页面，模拟番茄钟式专注过程。
- 支持短启动、标准专注和深度专注三种时间长度。
- 专注结束后会出现三个低压力选择：标记任务完成、再来一轮、休息一下。
- 支持休息倒计时，并可设置专注结束后优先推荐休息。
- 记录当天完成的专注轮数和累计专注分钟数。
- 显示今日专注记录，用户可以看到自己完成过哪些任务。
- 显示最近 7 天专注趋势图，用简单图表呈现学习投入变化。
- 支持导出今日专注记录，方便写项目过程记录或学习反思。
- 支持任务状态管理，包括未开始、进行中和已完成。
- 支持中英双语界面切换。
- 支持柔和模式和夜间模式，夜间模式已针对文字对比度进行调整。
- 使用浏览器本地存储保存任务、设置和专注记录。
- 已接入 Supabase/PostgreSQL 云端数据库，同步任务和专注记录。

## 项目设计原因

我在设计这个应用时主要考虑了三个问题：

- 第一，任务列表不能太复杂，否则用户会在开始之前就感到压力。
- 第二，任务应该被拆成具体的小步骤，而不是只写一个很大的目标。
- 第三，用户点击开始后应该直接进入专注状态，而不是停留在普通列表页面。

因此，本项目没有把功能做得非常复杂，而是把重点放在“快速记录任务”和“快速进入专注”这两个核心流程上。我认为这更符合低阻力时间管理系统的设计原则。

后续改进中，我又加入了专注记录和 7 天趋势图。这样项目不只是一个计时器，而是可以让用户看到自己实际完成过的专注轮次。这个改动也让应用更接近一个完整的学习管理工具。

## 使用技术

- React
- JavaScript
- CSS
- LocalStorage 本地数据保存
- Supabase / PostgreSQL 数据库
- SQL 数据表设计
- Vercel Serverless API Routes
- 浏览器 Clipboard API / 文件下载
- Vercel 部署
- Git / GitHub 版本控制

## 数据库与后端说明

本项目最初使用 `localStorage` 保存数据，这样即使没有后端也可以正常运行。为了更好地满足课程中关于 database、SQL utilization 和 client/server-side programming 的要求，项目后续加入了 Supabase 云端同步方案。当前线上部署已经配置 Supabase/PostgreSQL 数据库，并通过 Vercel Serverless API 完成真实读写。

数据库部分使用 Supabase 提供的 PostgreSQL。SQL 建表文件位于：

```text
supabase/schema.sql
```

该文件定义了两个主要数据表：

- `tasks`：保存任务标题、课程、最小下一步、精力级别、截止日期、状态和今日聚焦信息。
- `focus_sessions`：保存每次专注记录，包括任务名称、专注分钟数、日期和完成时间。

后端部分使用 Vercel Serverless API Routes，接口文件位于：

```text
api/tasks.js
api/focus-sessions.js
```

前端 React 页面通过这些 API 与 Supabase 数据库通信。这样项目中既有客户端页面逻辑，也有服务器端接口逻辑。

如果本地没有配置 Supabase 环境变量，项目会自动回到本地模式，保证应用打开后仍然可以使用。如果需要在本地或新的 Vercel 项目中启用 Supabase 云端同步，需要先在 Supabase SQL Editor 中运行 `supabase/schema.sql`，然后在环境变量中配置：

```text
REACT_APP_ENABLE_CLOUD_SYNC=true
REACT_APP_FOCUSFLOW_USER_ID=demo-user
SUPABASE_URL=你的 Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase Service Role Key
```

说明：真实密钥不应该提交到 GitHub，因此仓库中只提供 `.env.example` 作为配置示例。

## 线上演示数据

当前线上演示环境已经清理掉测试任务，并替换为更接近真实课程项目场景的任务，例如：

- 检查 FocusFlow 答辩 PPT。
- 更新 GitHub README。
- 录制产品 Demo 视频。
- 整理 ADHD 友好设计引用。
- 检查移动端页面体验。
- 完成 Supabase 数据库配置。

这些任务和专注记录保存在 Supabase 的 `tasks` 和 `focus_sessions` 表中。打开线上应用后，设置面板会显示云端同步状态；新增、修改或删除任务后，数据会通过 Vercel API 同步到 Supabase 数据库。

## 本地运行方法

如果需要在本地运行项目，可以在项目文件夹中执行：

```bash
npm install
npm start
```

运行后在浏览器中打开：

```text
http://localhost:3000
```

## 测试和打包

运行测试：

```bash
npm test -- --watch=false
```

生成生产版本：

```bash
npm run build
```

## 文件说明

- `src/App.js`：应用主要功能和页面结构。
- `src/App.css`：主要页面样式。
- `src/index.css`：全局样式。
- `src/App.test.js`：基础交互测试，包括双语切换、任务模板和专注模式入口。
- `api/tasks.js`：任务云端同步 API。
- `api/focus-sessions.js`：专注记录云端同步 API。
- `supabase/schema.sql`：Supabase/PostgreSQL 数据库建表 SQL。
- `.env.example`：云端同步环境变量示例。
- `public/index.html`：React 项目的 HTML 模板。
- `package.json`：项目依赖和运行脚本。
- `package-lock.json`：依赖版本锁定文件。
- `.gitignore`：忽略本地构建文件、作业文档、截图和临时文件。

说明：本 GitHub 仓库只保留应用代码和 README。课程论文、PPT、demo 录屏和项目过程记录作为单独提交材料提供，不放在代码仓库中，避免仓库内容过于复杂。

## 项目总结

通过这个项目，我完成了一个可以在线访问的 React Web 应用，并且在开发过程中学习了组件状态管理、本地数据存储、页面交互设计、倒计时逻辑、响应式页面布局、SQL 数据表设计、后端 API 接口、Vercel 部署和 GitHub 版本控制流程。

这个项目最终不是一个功能堆叠型的待办事项工具，而是一个围绕学生真实学习困难设计的专注辅助系统。它更强调降低开始任务的阻力，让用户能够从任务记录自然过渡到专注执行。
