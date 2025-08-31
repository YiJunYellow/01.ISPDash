-- =============================================
-- 創建壓合車間真空曲線資料表
-- =============================================

USE ISPDash;
GO

-- 檢查資料表是否存在，如果存在則刪除
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Pressing_VacuumHistory]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[Pressing_VacuumHistory];
    PRINT '已刪除現有的 Pressing_VacuumHistory 資料表';
END
GO

-- 創建壓合車間真空曲線資料表
CREATE TABLE [dbo].[Pressing_VacuumHistory] (
    [ID] INT IDENTITY(1,1) NOT NULL,
    [EquipmentID] VARCHAR(50) NOT NULL,
    [RecordTime] DATETIME2(3) NOT NULL,
    [VacuumPressure] DECIMAL(5,2) NOT NULL,  -- 真空壓力 (Torr)
    [Temperature] DECIMAL(5,2) NULL,          -- 溫度 (°C)
    [Pressure] DECIMAL(5,2) NULL,             -- 壓力 (Bar)
    [Status] NVARCHAR(20) NOT NULL DEFAULT 'NORMAL', -- 狀態: NORMAL, WARNING, ALARM
    [CreatedTime] DATETIME2(3) NOT NULL DEFAULT GETDATE(),
    
    -- 主鍵約束
    CONSTRAINT [PK_Pressing_VacuumHistory] PRIMARY KEY CLUSTERED ([ID] ASC)
);
GO

-- 創建索引
CREATE NONCLUSTERED INDEX [IX_Pressing_VacuumHistory_Equipment] ON [dbo].[Pressing_VacuumHistory] ([EquipmentID] ASC);
CREATE NONCLUSTERED INDEX [IX_Pressing_VacuumHistory_Time] ON [dbo].[Pressing_VacuumHistory] ([RecordTime] ASC);
CREATE NONCLUSTERED INDEX [IX_Pressing_VacuumHistory_EquipmentTime] ON [dbo].[Pressing_VacuumHistory] ([EquipmentID] ASC, [RecordTime] ASC);
GO

-- 添加檢查約束
ALTER TABLE [dbo].[Pressing_VacuumHistory] 
ADD CONSTRAINT [CK_Pressing_VacuumHistory_VacuumPressure] 
CHECK ([VacuumPressure] >= 0 AND [VacuumPressure] <= 10);
GO

ALTER TABLE [dbo].[Pressing_VacuumHistory] 
ADD CONSTRAINT [CK_Pressing_VacuumHistory_Temperature] 
CHECK ([Temperature] >= 0 AND [Temperature] <= 200);
GO

ALTER TABLE [dbo].[Pressing_VacuumHistory] 
ADD CONSTRAINT [CK_Pressing_VacuumHistory_Pressure] 
CHECK ([Pressure] >= 0 AND [Pressure] <= 10);
GO

ALTER TABLE [dbo].[Pressing_VacuumHistory] 
ADD CONSTRAINT [CK_Pressing_VacuumHistory_Status] 
CHECK ([Status] IN ('NORMAL', 'WARNING', 'ALARM'));
GO

PRINT 'Pressing_VacuumHistory 資料表創建完成！';
GO

-- =============================================
-- 插入範例資料 - 過去2天到未來7天每小時一筆
-- =============================================

-- 使用 CTE 和 CROSS JOIN 生成過去2天到未來7天的每小時數據
WITH DateHours AS (
    SELECT 
        DATEADD(HOUR, n, GETDATE()) AS RecordTime
    FROM (
        SELECT TOP (24 * 9) -- 9天 * 24小時 = 216小時 (過去2天 + 未來7天)
            ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 48 AS n  -- 從-48開始(過去2天)到167(未來7天)
        FROM master..spt_values t1
        CROSS JOIN master..spt_values t2
    ) numbers
),
EquipmentBase AS (
    SELECT 'P01A' AS EquipmentID, 2.10 AS BaseVacuum, 78.5 AS BaseTemp, 1.8 AS BasePressure, 'NORMAL' AS BaseStatus
    UNION ALL SELECT 'P01B', 1.50, 76.2, 1.6, 'NORMAL'
    UNION ALL SELECT 'P02A', 0.80, 74.1, 1.3, 'WARNING'
    UNION ALL SELECT 'P02B', 0.30, 82.5, 2.0, 'NORMAL'
)
INSERT INTO [dbo].[Pressing_VacuumHistory] ([EquipmentID], [RecordTime], [VacuumPressure], [Temperature], [Pressure], [Status])
SELECT 
    e.EquipmentID,
    dh.RecordTime,
    -- 真空壓力：基礎值 + 時間變化 + 隨機波動
    CAST(e.BaseVacuum + 
          (DATEPART(HOUR, dh.RecordTime) * 0.15) + 
          (RAND(CHECKSUM(NEWID())) * 0.5 - 0.25) AS DECIMAL(5,2)) AS VacuumPressure,
    -- 溫度：基礎值 + 時間變化 + 隨機波動
    CAST(e.BaseTemp + 
          (DATEPART(HOUR, dh.RecordTime) * 0.8) + 
          (RAND(CHECKSUM(NEWID())) * 2.0 - 1.0) AS DECIMAL(5,2)) AS Temperature,
    -- 壓力：基礎值 + 時間變化 + 隨機波動
    CAST(e.BasePressure + 
          (DATEPART(HOUR, dh.RecordTime) * 0.05) + 
          (RAND(CHECKSUM(NEWID())) * 0.2 - 0.1) AS DECIMAL(5,2)) AS Pressure,
    -- 狀態：根據真空壓力判斷
    CASE 
        WHEN e.BaseStatus = 'WARNING' THEN 'WARNING'
        WHEN e.BaseVacuum + (DATEPART(HOUR, dh.RecordTime) * 0.15) > 6.0 THEN 'ALARM'
        ELSE 'NORMAL'
    END AS Status
FROM DateHours dh
CROSS JOIN EquipmentBase e
ORDER BY e.EquipmentID, dh.RecordTime;
GO

-- 顯示插入的資料數量
SELECT COUNT(*) AS '插入的真空曲線資料筆數' FROM [dbo].[Pressing_VacuumHistory];
GO

-- 顯示各設備的資料統計
SELECT 
    [EquipmentID],
    COUNT(*) AS '資料筆數',
    MIN([VacuumPressure]) AS '最小真空壓力',
    MAX([VacuumPressure]) AS '最大真空壓力',
    AVG([VacuumPressure]) AS '平均真空壓力'
FROM [dbo].[Pressing_VacuumHistory]
GROUP BY [EquipmentID]
ORDER BY [EquipmentID];
GO

PRINT '壓合車間真空曲線資料表創建和範例資料插入完成！';
GO
