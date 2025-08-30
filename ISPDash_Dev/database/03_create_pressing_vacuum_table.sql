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
-- 插入範例資料
-- =============================================

-- 插入 P01A 設備的真空曲線資料 (11:00-14:30, 每30分鐘一筆)
INSERT INTO [dbo].[Pressing_VacuumHistory] ([EquipmentID], [RecordTime], [VacuumPressure], [Temperature], [Pressure], [Status]) VALUES
('P01A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 11:00:00', 3.50, 85.2, 2.1, 'NORMAL'),
('P01A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 11:30:00', 4.20, 87.5, 2.3, 'NORMAL'),
('P01A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 12:00:00', 4.80, 89.1, 2.5, 'NORMAL'),
('P01A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 12:30:00', 5.40, 91.3, 2.7, 'NORMAL'),
('P01A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 13:00:00', 6.10, 93.8, 2.9, 'NORMAL'),
('P01A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 13:30:00', 6.50, 95.2, 3.1, 'NORMAL'),
('P01A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 14:00:00', 5.80, 92.7, 2.8, 'NORMAL'),
('P01A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 14:30:00', 4.50, 88.9, 2.4, 'NORMAL');

-- 插入 P01B 設備的真空曲線資料
INSERT INTO [dbo].[Pressing_VacuumHistory] ([EquipmentID], [RecordTime], [VacuumPressure], [Temperature], [Pressure], [Status]) VALUES
('P01B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 11:00:00', 2.00, 82.1, 1.8, 'NORMAL'),
('P01B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 11:30:00', 2.80, 84.6, 2.0, 'NORMAL'),
('P01B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 12:00:00', 3.50, 86.9, 2.2, 'NORMAL'),
('P01B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 12:30:00', 4.20, 89.4, 2.4, 'NORMAL'),
('P01B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 13:00:00', 4.90, 91.7, 2.6, 'NORMAL'),
('P01B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 13:30:00', 5.50, 93.2, 2.8, 'NORMAL'),
('P01B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 14:00:00', 4.80, 90.5, 2.5, 'NORMAL'),
('P01B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 14:30:00', 3.50, 86.8, 2.1, 'NORMAL');

-- 插入 P02A 設備的真空曲線資料 (較低效率)
INSERT INTO [dbo].[Pressing_VacuumHistory] ([EquipmentID], [RecordTime], [VacuumPressure], [Temperature], [Pressure], [Status]) VALUES
('P02A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 11:00:00', 1.00, 78.5, 1.5, 'WARNING'),
('P02A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 11:30:00', 1.80, 80.2, 1.7, 'WARNING'),
('P02A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 12:00:00', 2.50, 82.8, 1.9, 'WARNING'),
('P02A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 12:30:00', 3.50, 85.1, 2.1, 'WARNING'),
('P02A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 13:00:00', 2.80, 83.4, 1.8, 'WARNING'),
('P02A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 13:30:00', 2.20, 81.7, 1.6, 'WARNING'),
('P02A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 14:00:00', 1.50, 79.9, 1.4, 'WARNING'),
('P02A', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 14:30:00', 1.00, 77.3, 1.2, 'WARNING');

-- 插入 P02B 設備的真空曲線資料 (高效率)
INSERT INTO [dbo].[Pressing_VacuumHistory] ([EquipmentID], [RecordTime], [VacuumPressure], [Temperature], [Pressure], [Status]) VALUES
('P02B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 11:00:00', 0.50, 88.7, 2.3, 'NORMAL'),
('P02B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 11:30:00', 1.20, 90.4, 2.5, 'NORMAL'),
('P02B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 12:00:00', 2.10, 92.1, 2.7, 'NORMAL'),
('P02B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 12:30:00', 3.20, 94.8, 2.9, 'NORMAL'),
('P02B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 13:00:00', 4.50, 96.3, 3.1, 'NORMAL'),
('P02B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 13:30:00', 3.80, 94.1, 2.8, 'NORMAL'),
('P02B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 14:00:00', 3.20, 91.6, 2.5, 'NORMAL'),
('P02B', CAST(CAST(GETDATE() AS DATE) AS VARCHAR(10)) + ' 14:30:00', 2.50, 89.2, 2.2, 'NORMAL');
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
