const express = require('express');
const router = express.Router();
const database = require('../database');
const config = require('../config');

// 獲取設備總覽
router.get('/overall', async (req, res) => {
  try {
    console.log('收到設備數據請求');
    
    const { area } = req.query;
    console.log('查詢參數:', { area });
    
    let query = `
      SELECT 
        EquipmentID,
        EquipmentType,
        EquipmentState,
        MEName,
        OPName,
        CompletionRate,
        AlarmCount,
        ProductionTime,
        LastUpdateTime
      FROM EquipmentOverview
    `;
    
    // 如果指定了區域，添加篩選條件
    if (area) {
      query += ` WHERE EquipmentID LIKE '${area}-%'`;
    }
    
    query += ` ORDER BY EquipmentID`;
    
    console.log('執行查詢:', query);
    
    const result = await database.query(query);
    console.log(`查詢成功，返回 ${result.length} 條記錄`);
    
    res.json(result);
  } catch (err) {
    console.error('❌ 獲取設備數據失敗:', err.message);
    console.error('錯誤詳情:', err);
    res.status(500).json({ error: '獲取設備數據失敗', details: err.message });
  }
});

// 獲取單個設備數據
router.get('/overall/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        EquipmentID,
        EquipmentType,
        EquipmentState,
        MEName,
        OPName,
        CompletionRate,
        AlarmCount,
        ProductionTime,
        LastUpdateTime
      FROM EquipmentOverview
      WHERE EquipmentID = @equipmentId
    `;
    
    const result = await database.query(query, [id]);
    
    if (result.length === 0) {
      return res.status(404).json({ error: '設備未找到' });
    }
    
    res.json(result[0]);
  } catch (err) {
    console.error('獲取設備數據失敗:', err);
    res.status(500).json({ error: '獲取設備數據失敗' });
  }
});

// 更新設備狀態
router.put('/overall/:id/state', async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    
    if (!state || !['RUN', 'IDLE', 'DOWN'].includes(state)) {
      return res.status(400).json({ error: '無效的設備狀態' });
    }
    
    const query = `
      UPDATE EquipmentOverview
      SET EquipmentState = @state,
          LastUpdateTime = GETDATE()
      WHERE EquipmentID = @equipmentId
    `;
    
    const result = await database.query(query, [state, id]);
    
    res.json({ message: '設備狀態更新成功' });
  } catch (err) {
    console.error('更新設備狀態失敗:', err);
    res.status(500).json({ error: '更新設備狀態失敗' });
  }
});

// 更新設備警報數量
router.put('/overall/:id/alarm', async (req, res) => {
  try {
    const { id } = req.params;
    const { alarmCount } = req.body;
    
    if (typeof alarmCount !== 'number' || alarmCount < 0) {
      return res.status(400).json({ error: '無效的警報數量' });
    }
    
    const query = `
      UPDATE EquipmentOverview
      SET AlarmCount = @alarmCount,
          LastUpdateTime = GETDATE()
      WHERE EquipmentID = @equipmentId
    `;
    
    await database.query(query, [alarmCount, id]);
    
    res.json({ message: '警報數量更新成功' });
  } catch (err) {
    console.error('更新警報數量失敗:', err);
    res.status(500).json({ error: '更新警報數量失敗' });
  }
});

// 獲取設備統計摘要
router.get('/summary', async (req, res) => {
  try {
    const { area } = req.query;
    
    let query = `
      SELECT 
        EquipmentState,
        COUNT(*) as Count
      FROM EquipmentOverview
    `;
    
    if (area) {
      query += ` WHERE EquipmentID LIKE '${area}-%'`;
    }
    
    query += ` GROUP BY EquipmentState`;
    
    const result = await database.query(query);
    
    const stats = {
      RUN: 0,
      IDLE: 0,
      DOWN: 0
    };
    
    result.forEach(row => {
      stats[row.EquipmentState] = row.Count;
    });
    
    res.json(stats);
  } catch (err) {
    console.error('獲取統計數據失敗:', err);
    res.status(500).json({ error: '獲取統計數據失敗' });
  }
});



module.exports = router;
