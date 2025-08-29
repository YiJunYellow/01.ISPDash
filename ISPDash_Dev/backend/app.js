const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // 服務靜態文件

// SQL Server 配置 - 使用新創建的帳戶
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

// 數據庫連接池
let pool;

async function connectDB() {
  try {
    console.log('正在連接到 SQL Server...');
    console.log('連接配置:', {
      server: sqlConfig.server,
      database: sqlConfig.database,
      user: sqlConfig.user,
      instanceName: sqlConfig.options.instanceName
    });
    
    // 先測試基本連接
    pool = await sql.connect(sqlConfig);
    console.log('✅ 成功連接到 SQL Server');
    
    // 測試查詢
    const result = await pool.request().query('SELECT COUNT(*) as count FROM EquipmentOverview');
    console.log(`✅ 數據庫連接正常，EquipmentOverview 表中有 ${result.recordset[0].count} 條記錄`);
    
    // 測試查詢所有設備
    const equipResult = await pool.request().query('SELECT TOP 3 * FROM EquipmentOverview');
    console.log('✅ 測試查詢成功，前3條記錄:', equipResult.recordset);
    
  } catch (err) {
    console.error('❌ 數據庫連接失敗:', err.message);
    console.error('錯誤代碼:', err.code);
    console.error('錯誤詳情:', err);
    
    // 提供具體的故障排除建議
    if (err.code === 'ELOGIN') {
      console.log('💡 請檢查用戶名和密碼是否正確');
    } else if (err.code === 'ESOCKET') {
      console.log('💡 請檢查 SQL Server 服務是否運行');
    } else if (err.code === 'ENOTFOUND') {
      console.log('💡 請檢查服務器名稱是否正確');
    } else if (err.code === 'ETIMEOUT') {
      console.log('💡 連接超時，請檢查網絡或防火牆設置');
    }
  }
}

// 初始化數據庫連接
connectDB();

// API 路由
app.use('/api/equipment', require('./routes/equipment'));

// 根路由 - 返回主頁
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服務器內部錯誤' });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`服務器運行在 http://localhost:${PORT}`);
});

module.exports = { app, pool };
