# 萬隆基督的教會服事表

## 開啟專案

安裝相關依賴，開啟開發伺服器

```bash
$ npm install
$ npm run prepare
$ cp .env.template .env.local
# open .env.local and put your google drive token
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 目錄結構

```
├─app
│ ├─service # 服事表相關頁面與元件
│ │ ├─_components # 包含服事表邏輯的元件
│ │ ├─_hooks # 包含服事表邏輯的 hooks
│ │ ├─page.tsx # 服事表主頁面
│ ├─layout.tsx # 首頁 Layout
│ ├─globals.css # 全域樣式
│ ├─page.tsx # （首頁）APP 進入點
├─components # 共用元件
│ ├─ui # UI 元件
├─lib # 共用函式庫
│ ├─utils.ts # 工具函式
├─providers # React Context Providers
│ ├─index.tsx # 頂層 providers 進入點
│ ├─query-client-provider.tsx # React Query Provider
├─public # 靜態資源
├─styles # 樣式檔案
├─.github # GitHub 設定
│ ├─workflows # GitHub Actions 工作流程
├─.husky # Husky 設定
├─.vscode # VSCode 設定
├─.eslintrc.js # ESLint 設定
├─.eslintignore # ESLint 忽略檔案
├─.prettierignore # Prettier 忽略檔案
├─next.config.mjs # Next.js 設定檔
├─package.json # npm 套件管理檔案
├─README.md # 專案說明文件
├─tailwind.config.ts # Tailwind CSS 設定檔
├─tsconfig.json # TypeScript 設定檔
```

## 佈署

### 佈署策略

```mermaid
graph TD
    A[PR created to main] --> B[[Run CI check: Lint check]]
    B --> C[PR merged to main]
    C --> D1[[CI check: Lint]]
    C --> D2[[Build test]]
    D1 & D2 --> E[sync to fork <br> schwannden/service/main]
    E --> F[[Deploy preview version <br> to Vercel]]
    C --> G[GitHub release created]
    G --> H[[Deploy to <br> Google App Engine]]
```

1. 這個專案使用 Google App Engine 作為 production 佈署平台，透過 Github Action 進行自動佈署。
2. 如果要調整 route，需要調整 `dispatch.yaml`，並且手動佈署： `gcloud app deploy dispatch.yaml`。

### 發佈

1. 發佈前，先到 `package.json` 將版本號修改: `npm version <new_version>`，進`main`。
2. 建立新的 Github Release，榠稱選擇剛剛的version，建立tag，自動產生change log。
3. 如果有重要feature更新，寫一下Release Note。
4. Release後會自動部署到Google App Engine。

### 監控

1. 使用 Sentry 進行錯誤監控。
2. 所有部署在 Vercel 的版本，Sentry上的release version 都是 preview。
3. 發 Github Release 才是正式版本，在 Sentry 上的版本會使用 package.json 的 version 作為版本名稱。
