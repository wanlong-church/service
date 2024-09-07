萬隆基督的教會服事表

## 開啟專案

First, run the development server:

```bash
$ npm install
$ npm run prepare
$ cp .env.template .env.local
# open .env.local and put your google drive token
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 目錄結構

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

## 佈署

1. 這個專案使用 Google App Engine 作為 production 佈署平台，透過 Github Action 進行自動佈署。
2. 如果要調整 route，需要調整 `dispatch.yaml`，並且手動佈署： `gcloud app deploy dispatch.yaml`。
