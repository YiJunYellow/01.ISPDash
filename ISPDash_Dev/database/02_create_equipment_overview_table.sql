-- =============================================
-- 創建 EquipmentOverview 資料表並插入範例資料
-- =============================================

USE ISPDash;
GO

-- 檢查資料表是否存在，如果存在則刪除
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EquipmentOverview]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[EquipmentOverview];
    PRINT '已刪除現有的 EquipmentOverview 資料表';
END
GO

-- 創建 EquipmentOverview 資料表
CREATE TABLE [dbo].[EquipmentOverview] (
    [EquipmentID] VARCHAR(50) NOT NULL,
    [EquipmentType] NVARCHAR(50) NOT NULL,
    [EquipmentState] NVARCHAR(20) NOT NULL DEFAULT 'IDLE',
    [MEName] NVARCHAR(50) NOT NULL,
    [OPName] NVARCHAR(50) NULL,
    [CompletionRate] DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    [AlarmCount] INT NULL DEFAULT 0,
    [ProductionTime] INT NULL DEFAULT 0,
    [LastUpdateTime] DATETIME2(3) NOT NULL DEFAULT GETDATE(),
    
    -- 主鍵約束
    CONSTRAINT [PK_EquipmentOverview] PRIMARY KEY CLUSTERED ([EquipmentID] ASC)
);
GO

-- 創建索引
CREATE NONCLUSTERED INDEX [IX_EquipmentOverview_State] ON [dbo].[EquipmentOverview] ([EquipmentState] ASC);
CREATE NONCLUSTERED INDEX [IX_EquipmentOverview_Type] ON [dbo].[EquipmentOverview] ([EquipmentType] ASC);
CREATE NONCLUSTERED INDEX [IX_EquipmentOverview_LastUpdate] ON [dbo].[EquipmentOverview] ([LastUpdateTime] ASC);
GO

-- 添加檢查約束
ALTER TABLE [dbo].[EquipmentOverview] 
ADD CONSTRAINT [CK_EquipmentOverview_State] 
CHECK ([EquipmentState] IN ('RUN', 'IDLE', 'DOWN'));
GO

ALTER TABLE [dbo].[EquipmentOverview] 
ADD CONSTRAINT [CK_EquipmentOverview_CompletionRate] 
CHECK ([CompletionRate] >= 0 AND [CompletionRate] <= 100);
GO

ALTER TABLE [dbo].[EquipmentOverview] 
ADD CONSTRAINT [CK_EquipmentOverview_AlarmCount] 
CHECK ([AlarmCount] >= 0);
GO

ALTER TABLE [dbo].[EquipmentOverview] 
ADD CONSTRAINT [CK_EquipmentOverview_ProductionTime] 
CHECK ([ProductionTime] >= 0);
GO

PRINT 'EquipmentOverview 資料表創建完成！';
GO

-- =============================================
-- 插入範例資料
-- =============================================

-- 插入範例資料
INSERT INTO [dbo].[EquipmentOverview] (
    [EquipmentID], 
    [EquipmentType], 
    [EquipmentState], 
    [MEName], 
    [OPName], 
    [CompletionRate], 
    [AlarmCount], 
    [ProductionTime], 
    [LastUpdateTime]
) VALUES 
    ('1F-BA0IPRE021', N'AOI檢測機#21', N'RUN', N'王曉明', N'李秀三', 85.50, 1, 180, GETDATE()),
    ('1F-BA0IPRE031', N'AOI檢測機#22', N'IDLE', N'王曉明', N'陳小華', 75.25, 2, 150, GETDATE()),
    ('1F-BA0IPRE041', N'AOI檢測機#23', N'DOWN', N'王曉明', N'王美玲', 45.30, 3, 90, GETDATE()),
    ('2F-BA0IPRE051', N'鑽孔機#21', N'RUN', N'張志明', N'林雅婷', 92.80, 0, 200, GETDATE()),
    ('2F-BA0IPRE061', N'鑽孔機#22', N'IDLE', N'張志明', N'張雅琪', 88.90, 1, 160, GETDATE()),
    ('2F-BA0IPRE071', N'鑽孔機#23', N'RUN', N'張志明', N'吳淑芬', 95.20, 0, 220, GETDATE()),
    ('2F-BA0IPRE081', N'鑽孔機#24', N'DOWN', N'張志明', N'陳雅文', 35.80, 4, 95, GETDATE()),
    ('3F-BA0IPRE091', N'壓合機#21', N'RUN', N'李明華', N'李佳玲', 78.90, 1, 170, GETDATE()),
    ('3F-BA0IPRE101', N'壓合機#22', N'IDLE', N'李明華', N'王雅君', 65.75, 2, 110, GETDATE()),
    ('3F-BA0IPRE111', N'壓合機#23', N'RUN', N'李明華', N'林美玲', 89.70, 0, 190, GETDATE()),
    ('3F-BA0IPRE121', N'壓合機#24', N'DOWN', N'李明華', N'黃志偉', 25.60, 3, 80, GETDATE()),
    ('1F-BA0IPRE131', N'曝光機#21', N'RUN', N'王曉明', N'劉建國', 82.45, 1, 155, GETDATE()),
    ('1F-BA0IPRE141', N'曝光機#22', N'IDLE', N'王曉明', N'張志豪', 70.40, 2, 130, GETDATE()),
    ('2F-BA0IPRE151', N'曝光機#23', N'RUN', N'王曉明', N'陳俊宏', 91.30, 0, 210, GETDATE()),
    ('2F-BA0IPRE161', N'曝光機#24', N'DOWN', N'王曉明', N'林俊傑', 40.20, 3, 85, GETDATE()),
    ('1F-BA0IPRE171', N'蝕刻機#21', N'RUN', N'張志明', N'王建民', 88.50, 1, 165, GETDATE()),
    ('2F-BA0IPRE181', N'蝕刻機#22', N'IDLE', N'張志明', N'趙志偉', 72.30, 2, 125, GETDATE()),
    ('3F-BA0IPRE191', N'蝕刻機#23', N'RUN', N'張志明', N'孫小華', 94.60, 0, 195, GETDATE()),
    ('3F-BA0IPRE201', N'蝕刻機#24', N'DOWN', N'張志明', N'周美玲', 38.90, 4, 88, GETDATE()),
    ('2F-BA0IPRE211', N'電鍍機#21', N'RUN', N'李明華', N'吳雅婷', 87.20, 1, 175, GETDATE());
GO

-- 顯示插入的資料數量
SELECT COUNT(*) AS '插入的資料筆數' FROM [dbo].[EquipmentOverview];
GO

-- 顯示資料統計
SELECT 
    [EquipmentState],
    COUNT(*) AS '設備數量'
FROM [dbo].[EquipmentOverview]
GROUP BY [EquipmentState]
ORDER BY [EquipmentState];
GO

PRINT 'EquipmentOverview 資料表創建和範例資料插入完成！';
GO
