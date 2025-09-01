-- =============================================
-- 創建壓合不良品資料表並插入範例資料
-- =============================================

USE ISPDash;
GO

-- 檢查資料表是否存在，如果存在則刪除
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Pressing_StatusSummary]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[Pressing_StatusSummary];
    PRINT '已刪除現有的 Pressing_StatusSummary 資料表';
END
GO


-- 創建壓合狀態統計資料表
CREATE TABLE [dbo].[Pressing_StatusSummary] (
    [ID] INT IDENTITY(1,1) NOT NULL,
    [EquipmentID] VARCHAR(50) NOT NULL,           -- 機台編號 (P01A, P01B, P02A, P02B)
    [TotalPressingCount] INT NOT NULL DEFAULT 0,  -- 壓合總數 (單位: Hour)
    [DefectCount] INT NOT NULL DEFAULT 0,         -- 不良品數量
    [DefectRate] DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- 不良率 (%)
    [AlarmCount] INT NOT NULL DEFAULT 0,          -- 壓機警報數
    [OperationRate] DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- 稼動率 (%)
    [Status] NVARCHAR(20) NOT NULL DEFAULT 'NORMAL', -- 狀態: NORMAL, WARNING, DANGER
    [LastUpdateTime] DATETIME2(3) NOT NULL DEFAULT GETDATE(),
    
    -- 主鍵約束
    CONSTRAINT [PK_Pressing_DefectSummary] PRIMARY KEY CLUSTERED ([ID] ASC)
);
GO

-- 創建索引
CREATE NONCLUSTERED INDEX [IX_Pressing_StatusSummary_Equipment] ON [dbo].[Pressing_StatusSummary] ([EquipmentID] ASC);
CREATE NONCLUSTERED INDEX [IX_Pressing_StatusSummary_Status] ON [dbo].[Pressing_StatusSummary] ([Status] ASC);
GO

-- 添加檢查約束
ALTER TABLE [dbo].[Pressing_StatusSummary] 
ADD CONSTRAINT [CK_Pressing_StatusSummary_TotalPressingCount] 
CHECK ([TotalPressingCount] >= 0);
GO

ALTER TABLE [dbo].[Pressing_StatusSummary] 
ADD CONSTRAINT [CK_Pressing_StatusSummary_DefectCount] 
CHECK ([DefectCount] >= 0);
GO

ALTER TABLE [dbo].[Pressing_StatusSummary] 
ADD CONSTRAINT [CK_Pressing_StatusSummary_DefectRate] 
CHECK ([DefectRate] >= 0 AND [DefectRate] <= 100);
GO

ALTER TABLE [dbo].[Pressing_StatusSummary] 
ADD CONSTRAINT [CK_Pressing_StatusSummary_AlarmCount] 
CHECK ([AlarmCount] >= 0);
GO

ALTER TABLE [dbo].[Pressing_StatusSummary] 
ADD CONSTRAINT [CK_Pressing_StatusSummary_OperationRate] 
CHECK ([OperationRate] >= 0 AND [OperationRate] <= 100);
GO

ALTER TABLE [dbo].[Pressing_StatusSummary] 
ADD CONSTRAINT [CK_Pressing_StatusSummary_Status] 
CHECK ([Status] IN ('NORMAL', 'WARNING', 'DANGER'));
GO

-- 添加唯一約束：每台機台只能有一筆記錄
ALTER TABLE [dbo].[Pressing_StatusSummary] 
ADD CONSTRAINT [UQ_Pressing_StatusSummary_Equipment] 
UNIQUE ([EquipmentID]);
GO

PRINT 'Pressing_StatusSummary 資料表創建完成！';
GO

-- =============================================
-- 插入範例資料 - 基於柱狀圖數據
-- =============================================

-- 插入壓合狀態統計資料
INSERT INTO [dbo].[Pressing_StatusSummary] (
    [EquipmentID], 
    [TotalPressingCount], 
    [DefectCount], 
    [DefectRate], 
    [AlarmCount], 
    [OperationRate],
    [Status], 
    [LastUpdateTime]
) VALUES 
    ('P01A', 210, 8, 3.80, 1, 72.00, 'NORMAL', GETDATE()),
    ('P01B', 230, 8, 3.48, 0, 74.00, 'NORMAL', GETDATE()),
    ('P02A', 95, 12, 92.63, 8, 13.00, 'DANGER', GETDATE()),
    ('P02B', 285, 8, 2.81, 1, 94.00, 'NORMAL', GETDATE());
GO

-- 顯示插入結果統計
-- =============================================

PRINT '=============================================';
PRINT '壓合狀態統計資料表建立完成！';
PRINT '=============================================';

-- 顯示今天的統計資料
SELECT 
    '即時統計' AS [統計類型],
    COUNT(*) AS [記錄筆數],
    SUM([TotalPressingCount]) AS [總壓合數],
    SUM([DefectCount]) AS [總不良品數],
    AVG([DefectRate]) AS [平均不良率],
    SUM([AlarmCount]) AS [總警報數],
    AVG([OperationRate]) AS [平均稼動率]
FROM [dbo].[Pressing_StatusSummary];

-- 顯示各機台狀態
SELECT 
    [EquipmentID] AS [機台],
    [TotalPressingCount] AS [壓合總數],
    [DefectCount] AS [不良品數],
    [DefectRate] AS [不良率(%)],
    [AlarmCount] AS [警報數],
    [OperationRate] AS [稼動率(%)],
    [Status] AS [狀態]
FROM [dbo].[Pressing_StatusSummary]
ORDER BY [EquipmentID];

PRINT '=============================================';
PRINT '資料表建立和範例資料插入完成！';
PRINT '=============================================';
GO
