# ISPDash 資料庫結構文件

這個資料夾包含了 ISPDash 系統的完整資料庫結構和範例資料。

## 📁 文件說明

### 1. `01_create_database.sql`
- **用途**: 創建 ISPDash 資料庫
- **功能**: 
  - 創建新的 ISPDash 資料庫
  - 使用 SQL Server 預設設定

### 2. `02_create_equipment_overview_table.sql`
- **用途**: 創建 EquipmentOverview 資料表並插入範例資料
- **功能**:
  - 創建設備總覽資料表結構
  - 設定主鍵、索引和檢查約束
  - 包含所有必要的欄位和資料類型
  - 插入 20 筆範例設備資料
  - 包含不同狀態（RUN、IDLE、DOWN）的設備
  - 顯示插入結果統計

### 3. `03_create_pressing_vacuum_table.sql`
- **用途**: 創建壓合車間真空曲線資料表並插入範例資料
- **功能**:
  - 創建真空曲線資料表結構
  - 包含真空壓力、溫度、壓力等製程參數
  - 插入 4 台壓機的真空曲線資料
  - 涵蓋 11:00-14:30 的時間範圍
  - 每 30 分鐘一筆資料點

## 🗄️ 資料表結構

### EquipmentOverview 資料表

| 欄位名稱 | 資料類型 | 說明 | 約束 |
|---------|---------|------|------|
| EquipmentID | VARCHAR(50) | 設備編號 | 主鍵 |
| EquipmentType | NVARCHAR(50) | 設備類型 | NOT NULL |
| EquipmentState | NVARCHAR(20) | 設備狀態 | RUN/IDLE/DOWN |
| MEName | NVARCHAR(50) | 設備工程師 | NOT NULL |
| OPName | NVARCHAR(50) | 操作員 | NULL |
| CompletionRate | DECIMAL(5,2) | 達成率 | 0-100% |
| AlarmCount | INT | 警報數量 | >= 0 |
| ProductionTime | INT | 生產時間(分鐘) | >= 0 |
| LastUpdateTime | DATETIME2(3) | 最後更新時間 | 自動更新 |

### Pressing_VacuumHistory 資料表

| 欄位名稱 | 資料類型 | 說明 | 約束 |
|---------|---------|------|------|
| ID | INT | 自動編號 | 主鍵 |
| EquipmentID | VARCHAR(50) | 設備編號 | NOT NULL |
| RecordTime | DATETIME2(3) | 記錄時間 | NOT NULL |
| VacuumPressure | DECIMAL(5,2) | 真空壓力 (Torr) | 0-10 |
| Temperature | DECIMAL(5,2) | 溫度 (°C) | 0-200 |
| Pressure | DECIMAL(5,2) | 壓力 (Bar) | 0-10 |
| Status | NVARCHAR(20) | 狀態 | NORMAL/WARNING/ALARM |
| CreatedTime | DATETIME2(3) | 建立時間 | 自動更新 |

## 🔧 執行順序

請按照以下順序執行 SQL 腳本：

1. `01_create_database.sql` - 創建資料庫
2. `02_create_equipment_overview_table.sql` - 創建設備總覽資料表並插入範例資料
3. `03_create_pressing_vacuum_table.sql` - 創建壓合車間真空曲線資料表並插入範例資料

## 📊 範例資料

範例資料包含：
- **20 台設備**，分布於 1F、2F、3F 三個樓層
- **6 種設備類型**: AOI檢測機#21-23、鑽孔機#21-24、壓合機#21-24、曝光機#21-24、蝕刻機#21-24、電鍍機#21
- **3 位 ME 工程師**: 王曉明、張志明、李明華
- **20 位不同的 OP 操作員**
- **3 種狀態**: RUN（運行中）、IDLE（閒置）、DOWN（故障）
- **合理的數值範圍**用於達成率、警報數和生產時間

### 壓合車間真空曲線資料
- **4 台壓機**: P01A、P01B、P02A、P02B
- **時間範圍**: 11:00-14:30，每 30 分鐘一筆資料
- **真空壓力範圍**: 0.5-6.5 Torr
- **溫度範圍**: 77-96°C
- **壓力範圍**: 1.2-3.1 Bar
- **狀態分布**: NORMAL、WARNING

## 🚀 快速開始

在 SQL Server Management Studio 中執行：

```sql
-- 1. 創建資料庫
EXECUTE [01_create_database.sql]

-- 2. 創建設備總覽資料表並插入範例資料
EXECUTE [02_create_equipment_overview_table.sql]

-- 3. 創建壓合車間真空曲線資料表並插入範例資料
EXECUTE [03_create_pressing_vacuum_table.sql]
```

## 📝 注意事項

- 執行前請確保有足夠的資料庫權限
- 資料庫檔案會自動存放在 SQL Server 的預設資料目錄
- 範例資料僅供測試使用，生產環境請使用真實資料
