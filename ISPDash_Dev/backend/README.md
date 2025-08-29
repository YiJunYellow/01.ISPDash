# ISPDash 後端 API

這是 ISPDash 系統的後端 API 服務，提供設備監控和數據管理功能。

## 功能特性

- 設備數據查詢和管理
- 設備狀態更新
- 警報數量管理
- 統計數據查詢
- SQL Server 數據庫集成

## 安裝和設置

### 1. 安裝依賴

```bash
cd backend
npm install
```

### 2. 配置環境變數

複製 `config.env.example` 為 `.env` 並修改配置：

```bash
cp config.env.example .env
```

編輯 `.env` 文件，設置你的數據庫連接信息：

```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ISPDashDB
DB_SERVER=localhost
PORT=3000
```

### 3. 啟動服務器

開發模式：
```bash
npm run dev
```

生產模式：
```bash
npm start
```

服務器將在 `http://localhost:3000` 啟動。

## API 端點

### 設備管理

- `GET /api/equipment` - 獲取所有設備數據
- `GET /api/equipment?area=HDI` - 獲取特定區域的設備數據
- `GET /api/equipment/:id` - 獲取單個設備數據
- `PUT /api/equipment/:id/state` - 更新設備狀態
- `PUT /api/equipment/:id/alarm` - 更新設備警報數量

### 統計數據

- `GET /api/equipment/stats/summary` - 獲取設備狀態統計

## 數據庫要求

確保 SQL Server 中已創建 `EquipmentOverview` 表：

```sql
CREATE TABLE EquipmentOverview (
    EquipmentID VARCHAR(20) PRIMARY KEY,
    EquipmentType VARCHAR(50) NOT NULL,
    EquipmentState VARCHAR(20) DEFAULT 'DOWN',
    MEName NVARCHAR(50),
    OPName NVARCHAR(50),
    CompletionRate DECIMAL(5,2) DEFAULT 0,
    AlarmCount INT DEFAULT 0,
    ProductionTime INT DEFAULT 0,
    LastUpdateTime DATETIME DEFAULT GETDATE()
);
```

## 開發

### 項目結構

```
backend/
├── app.js              # 主應用程序文件
├── package.json        # 項目配置
├── config.env.example  # 環境變數範例
├── routes/
│   └── equipment.js    # 設備相關路由
└── README.md          # 說明文件
```

### 添加新功能

1. 在 `routes/` 目錄下創建新的路由文件
2. 在 `app.js` 中註冊新路由
3. 更新文檔

## 故障排除

### 常見問題

1. **數據庫連接失敗**
   - 檢查數據庫服務是否運行
   - 確認連接字符串和憑證正確
   - 檢查防火牆設置

2. **API 返回 500 錯誤**
   - 檢查服務器日誌
   - 確認數據庫表結構正確
   - 驗證 SQL 查詢語法

## 授權

MIT License
