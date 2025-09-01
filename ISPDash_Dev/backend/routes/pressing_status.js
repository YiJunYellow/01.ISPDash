const express = require('express');
const router = express.Router();
const database = require('../database');
const config = require('../config');

// 獲取壓合車間稼動率數據
router.get('/', async (req, res) => {
  try {
    console.log('收到稼動率數據請求');
    
    // 查詢 Pressing_StatusSummary 表獲取稼動率數據
    const query = `
      SELECT 
        EquipmentID,
        TotalPressingCount,
        DefectCount,
        DefectRate,
        AlarmCount,
        OperationRate,
        Status,
        LastUpdateTime
      FROM Pressing_StatusSummary
      ORDER BY EquipmentID
    `;
    
    console.log('執行稼動率查詢:', query);
    
    const result = await database.query(query);
    console.log(`查詢成功，返回 ${result.length} 條記錄`);
    
    // 返回完整的設備狀態數據
    res.json(result);
  } catch (err) {
    console.error('❌ 獲取稼動率數據失敗:', err.message);
    console.error('錯誤詳情:', err);
    res.status(500).json({ error: '獲取稼動率數據失敗', details: err.message });
  }
});

// 獲取單個設備的稼動率數據
router.get('/:equipmentId', async (req, res) => {
  try {
    const { equipmentId } = req.params;
    console.log(`收到設備 ${equipmentId} 稼動率數據請求`);
    
    const query = `
      SELECT 
        EquipmentID,
        TotalPressingCount,
        DefectCount,
        DefectRate,
        AlarmCount,
        OperationRate,
        Status,
        LastUpdateTime
      FROM Pressing_StatusSummary
      WHERE EquipmentID = @equipmentId
    `;
    
    const result = await database.query(query, [equipmentId]);
    
    if (result.length === 0) {
      return res.status(404).json({ error: '設備稼動率數據未找到' });
    }
    
    res.json(result[0]);
  } catch (err) {
    console.error('獲取設備稼動率數據失敗:', err);
    res.status(500).json({ error: '獲取設備稼動率數據失敗' });
  }
});

// 更新設備稼動率數據
router.put('/:equipmentId', async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const { 
      TotalPressingCount, 
      DefectCount, 
      DefectRate, 
      AlarmCount, 
      OperationRate, 
      Status 
    } = req.body;
    
    console.log(`更新設備 ${equipmentId} 稼動率數據:`, req.body);
    
    const query = `
      UPDATE Pressing_StatusSummary
      SET 
        TotalPressingCount = @TotalPressingCount,
        DefectCount = @DefectCount,
        DefectRate = @DefectRate,
        AlarmCount = @AlarmCount,
        OperationRate = @OperationRate,
        Status = @Status,
        LastUpdateTime = GETDATE()
      WHERE EquipmentID = @equipmentId
    `;
    
    await database.query(query, [
      TotalPressingCount, 
      DefectCount, 
      DefectRate, 
      AlarmCount, 
      OperationRate, 
      Status, 
      equipmentId
    ]);
    
    res.json({ message: '設備稼動率數據更新成功' });
  } catch (err) {
    console.error('更新設備稼動率數據失敗:', err);
    res.status(500).json({ error: '更新設備稼動率數據失敗' });
  }
});

module.exports = router;
