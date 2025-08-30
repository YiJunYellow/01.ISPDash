# ISPDash 系統

## 架構說明

ISPDash 採用前後端分離架構：

- **前端**：純靜態文件（HTML/CSS/JavaScript），運行在 8080 端口
- **後端**：Node.js API 服務器，運行在 3000 端口
- **數據庫**：SQL Server

## 目錄結構

```
ISPDash_Dev/
├── frontend/                 # 前端文件
│   ├── index.html           # 壓合車間頁面
│   ├── eqp_overview.html    # 設備總覽頁面
│   ├── diaeap.html          # DIAEAP頁面
│   ├── style.css            # 樣式文件
│   ├── script.js            # 通用腳本
│   ├── eqp_overview.js      # 設備總覽腳本
│   ├── diaeap.js            # DIAEAP腳本
│   ├── config.js            # 前端配置
│   ├── api-service.js       # API服務模組
│   ├── iconbase/            # 圖標文件
│   └── package.json         # 前端依賴
├── backend/                 # 後端API服務器
│   ├── app.js              # 主服務器文件
│   ├── routes/             # API路由
│   │   └── eqp_overview.js # 設備總覽 API
│   ├── package.json        # 後端依賴
│   └── README.md           # 後端說明
└── README.md               # 本文件
```

## 快速開始

### 1. 啟動後端API服務器

```bash
cd backend
npm install
npm start
```

後端服務器將運行在 `http://localhost:3000`

### 2. 啟動前端開發服務器

```bash
# 在根目錄
npm install
npm run dev
```

前端將運行在 `http://localhost:8080`

### 3. 訪問應用

- 壓合車間：`http://localhost:8080/index.html`
- 設備總覽：`http://localhost:8080/eqp_overview.html`
- DIAEAP：`http://localhost:8080/diaeap.html`

## 配置說明

### 前端配置 (config.js)

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000',  // 後端API地址
    UPDATE_INTERVAL: 30000,                 // 數據更新頻率
    DEBUG: true                             // 調試模式
};
```

### 後端配置

環境變量或 `.env` 文件：

```env
DB_USER=sa
DB_PASSWORD=Test123!
DB_NAME=ISPDash
DB_SERVER=localhost\ISPDASH
PORT=3000
```

## API 端點

- `GET /api/equipment` - 獲取設備列表
- `GET /api/equipment/:id` - 獲取特定設備
- `PUT /api/equipment/:id/state` - 更新設備狀態
- `PUT /api/equipment/:id/alarm` - 更新設備警報
- `GET /api/equipment/stats/summary` - 獲取設備統計

## 生產環境部署

### 前端部署

1. 將前端文件部署到 Web 服務器（如 Nginx、Apache）
2. 修改 `config.js` 中的 `API_BASE_URL` 為生產環境的後端地址

### 後端部署

1. 使用 PM2 或 Docker 部署 Node.js 應用
2. 配置反向代理（如 Nginx）處理 API 請求
3. 設置環境變量

### 數據庫配置

確保 SQL Server 可以從後端服務器訪問，並配置適當的防火牆規則。

## 開發說明

- 前端修改後刷新瀏覽器即可
- 後端修改後需要重啟服務器（或使用 nodemon）
- API 調用統一通過 `api-service.js` 模組處理
- 所有配置集中在 `config.js` 中管理
