const express = require('express');
const router = express.Router();
const sql = require('mssql');

// SQL Server 配置
const sqlConfig = {
  user: process.env.DB_USER || 'ispdash_user',
  password: process.env.DB_PASSWORD || 'ISP@Dash2024!',
  database: process.env.DB_NAME || 'ISPDash',
  server: process.env.DB_SERVER || 'localhost\\ISPDASH',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },    
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

// 創建連接池
let pool;

async function getPool() {
  if (!pool) {
    try {
      console.log('創建新的數據庫連接池...');
      pool = await sql.connect(sqlConfig);
      console.log('✅ 連接池創建成功');
    } catch (error) {
      console.error('❌ 創建連接池失敗:', error);
      return null;
    }
  }
  return pool;
}

// 獲取所有設備數據
router.get('/', async (req, res) => {
  try {
    console.log('收到設備數據請求');
    
    // 獲取連接池
    const currentPool = await getPool();
    if (!currentPool) {
      console.error('數據庫連接池不可用');
      return res.status(500).json({ error: '數據庫連接不可用' });
    }
    
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
    
    const result = await currentPool.request().query(query);
    console.log(`查詢成功，返回 ${result.recordset.length} 條記錄`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ 獲取設備數據失敗:', err.message);
    console.error('錯誤詳情:', err);
    res.status(500).json({ error: '獲取設備數據失敗', details: err.message });
  }
});

// 獲取單個設備數據
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const currentPool = await getPool();
    if (!currentPool) {
      return res.status(500).json({ error: '數據庫連接不可用' });
    }
    
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
    
    const result = await currentPool.request()
      .input('equipmentId', sql.VarChar, id)
      .query(query);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: '設備未找到' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('獲取設備數據失敗:', err);
    res.status(500).json({ error: '獲取設備數據失敗' });
  }
});

// 更新設備狀態
router.put('/:id/state', async (req, res) => {
  try {
    const { id } = req.params;
    const { equipmentState } = req.body;
    
    const currentPool = await getPool();
    if (!currentPool) {
      return res.status(500).json({ error: '數據庫連接不可用' });
    }
    
    if (!equipmentState || !['RUN', 'IDLE', 'DOWN'].includes(equipmentState)) {
      return res.status(400).json({ error: '無效的設備狀態' });
    }
    
    const query = `
      UPDATE EquipmentOverview
      SET EquipmentState = @equipmentState,
          LastUpdateTime = GETDATE()
      WHERE EquipmentID = @equipmentId
    `;
    
    const result = await currentPool.request()
      .input('equipmentId', sql.VarChar, id)
      .input('equipmentState', sql.VarChar, equipmentState)
      .query(query);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: '設備未找到' });
    }
    
    res.json({ message: '設備狀態更新成功' });
  } catch (err) {
    console.error('更新設備狀態失敗:', err);
    res.status(500).json({ error: '更新設備狀態失敗' });
  }
});

// 更新設備警報數量
router.put('/:id/alarm', async (req, res) => {
  try {
    const { id } = req.params;
    const { alarmCount } = req.body;
    
    const currentPool = await getPool();
    if (!currentPool) {
      return res.status(500).json({ error: '數據庫連接不可用' });
    }
    
    if (typeof alarmCount !== 'number' || alarmCount < 0) {
      return res.status(400).json({ error: '無效的警報數量' });
    }
    
    const query = `
      UPDATE EquipmentOverview
      SET AlarmCount = @alarmCount,
          LastUpdateTime = GETDATE()
      WHERE EquipmentID = @equipmentId
    `;
    
    const result = await currentPool.request()
      .input('equipmentId', sql.VarChar, id)
      .input('alarmCount', sql.Int, alarmCount)
      .query(query);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: '設備未找到' });
    }
    
    res.json({ message: '警報數量更新成功' });
  } catch (err) {
    console.error('更新警報數量失敗:', err);
    res.status(500).json({ error: '更新警報數量失敗' });
  }
});

// 獲取設備統計數據
router.get('/stats/summary', async (req, res) => {
  try {
    const { area } = req.query;
    
    const currentPool = await getPool();
    if (!currentPool) {
      return res.status(500).json({ error: '數據庫連接不可用' });
    }
    
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
    
    const result = await currentPool.request().query(query);
    
    const stats = {
      RUN: 0,
      IDLE: 0,
      DOWN: 0
    };
    
    result.recordset.forEach(row => {
      stats[row.EquipmentState] = row.Count;
    });
    
    res.json(stats);
  } catch (err) {
    console.error('獲取統計數據失敗:', err);
    res.status(500).json({ error: '獲取統計數據失敗' });
  }
});

module.exports = router;
