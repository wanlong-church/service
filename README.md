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

## 功能列表

### 🚀 現有功能

- **首頁** - 非常樸素的標題以及進入頁面按鈕
- **介接 Google Sheet API** - 但是使用者看不到

### 🛠️ 開發中的功能

- **[頁面] 依據時間顯示所有服事** - UI 趕工中

### 📅 規劃中的功能

**[開發中功能請看 Projects](https://github.com/orgs/wanlong-church/projects/1)**

## 佈署

1. 這個專案使用 Google App Engine 作為 production 佈署平台，透過 Github Action 進行自動佈署。
2. 如果要調整 route，需要調整 `dispatch.yaml`，並且手動佈署： `gcloud app deploy dispatch.yaml`。