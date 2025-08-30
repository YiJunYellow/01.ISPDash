# ISPDash 後端 API 服務器

## 架構說明

後端採用模組化架構，所有配置集中在 `config.js` 中管理：

- **配置管理**：`config.js` - 統一管理所有配置
- **數據庫模組**：`database.js` - 數據庫連接和查詢管理
- **API 路由**：`routes/` - 各個 API 端點
- **主服務器**：`app.js` - Express 服務器主文件

## 目錄結構

```
backend/
├── config.js              # 配置文件
├── database.js            # 數據庫模組
├── app.js                 # 主服務器文件
├── routes/
│   └── eqp_overview.js    # 設備總覽 API
├── package.json           # 依賴管理
├── config.env.example     # 環境變量示例
└── README.md              # 本文件
```

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 配置環境變量

複製 `config.env.example` 為 `.env` 並修改配置：

```bash
cp config.env.example .env
```

### 3. 啟動服務器

```bash
npm start
```

服務器將運行在 `http://localhost:3000`

## 配置說明

### 服務器配置

```javascript
server: {
    port: 3000,                    // 服務器端口
    host: 'localhost',             // 服務器主機
    cors: {
        origin: '*',               // CORS 來源
        credentials: true          // 允許憑證
    }
}
```

### 數據庫配置

```javascript
database: {
    user: 'sa',                    // 數據庫用戶
    password: 'Test123!',          // 數據庫密碼
    database: 'ISPDash',           // 數據庫名稱
    server: 'localhost\\ISPDASH',  // SQL Server 實例
    pool: {                        // 連接池配置
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}
```

### API 配置

```javascript
api: {
    version: '1.0.0',              // API 版本
    prefix: '/api',                // API 前綴
    endpoints: {                   // API 端點
        eqpOverview: '/equipment',
        eqpOverviewStats: '/equipment/stats/summary'
    }
}
```

## API 端點

### 設備管理

- `GET /api/equipment` - 獲取所有設備
- `GET /api/equipment/:id` - 獲取特定設備
- `PUT /api/equipment/:id/state` - 更新設備狀態
- `PUT /api/equipment/:id/alarm` - 更新設備警報
- `GET /api/equipment/stats/summary` - 獲取設備統計

### 請求示例

```bash
# 獲取所有設備
curl http://localhost:3000/api/equipment

# 獲取特定設備
curl http://localhost:3000/api/equipment/1F-BA0IPRE021

# 更新設備狀態
curl -X PUT http://localhost:3000/api/equipment/1F-BA0IPRE021/state \
  -H "Content-Type: application/json" \
  -d '{"state": "RUN"}'

# 更新設備警報
curl -X PUT http://localhost:3000/api/equipment/1F-BA0IPRE021/alarm \
  -H "Content-Type: application/json" \
  -d '{"alarmCount": 5}'
```

## 數據庫模組

`database.js` 提供以下功能：

- **自動連接管理**：自動建立和維護數據庫連接
- **連接池優化**：使用連接池提高性能
- **錯誤處理**：統一的錯誤處理和日誌記錄
- **查詢簡化**：簡化的查詢接口

### 使用示例

```javascript
const database = require('./database');

// 執行查詢
const result = await database.query('SELECT * FROM EquipmentOverview');

// 執行參數化查詢
const equipment = await database.query(
    'SELECT * FROM EquipmentOverview WHERE EquipmentID = @equipmentId',
    ['1F-BA0IPRE021']
);

// 執行存儲過程
const stats = await database.executeProcedure('GetEquipmentStats', {
    area: '1F'
});
```

## 開發說明

### 添加新的 API 端點

1. 在 `routes/` 目錄下創建新的路由文件
2. 在 `app.js` 中註冊路由
3. 使用 `database.js` 模組進行數據庫操作

### 修改配置

所有配置都在 `config.js` 中，支持環境變量覆蓋：

```javascript
// 使用環境變量
port: process.env.PORT || 3000

// 使用配置文件
port: config.server.port
```

### 日誌配置

```javascript
logging: {
    level: 'info',                 // 日誌級別
    enableConsole: true,           // 控制台輸出
    enableFile: false              // 文件輸出
}
```

## 生產環境部署

### 使用 PM2

```bash
# 安裝 PM2
npm install -g pm2

# 啟動應用
pm2 start app.js --name "ispdash-api"

# 查看狀態
pm2 status

# 重啟應用
pm2 restart ispdash-api
```

### 使用 Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 環境變量

生產環境建議設置以下環境變量：

```bash
NODE_ENV=production
PORT=3000
DB_USER=sa
DB_PASSWORD=Test123!
DB_SERVER=your_sql_server
LOG_LEVEL=error
```
