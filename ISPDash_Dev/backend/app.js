const express = require('express');
const cors = require('cors');
const config = require('./config');
const database = require('./database');

const app = express();

// 中間件
app.use(cors(config.server.cors));
app.use(express.json());

// 初始化數據庫連接
database.connect().catch(err => {
    console.error('數據庫初始化失敗:', err);
    process.exit(1);
});

// API 路由
app.use(`${config.api.prefix}/eqp_overview`, require('./routes/eqp_overview'));
app.use(`${config.api.prefix}/pressing_status`, require('./routes/pressing_status'));

// API 服務器狀態檢查
app.get('/', (req, res) => {
    res.json({ 
        message: 'ISPDash API 服務器運行中',
        version: config.api.version,
        timestamp: new Date().toISOString(),
        database: {
            connected: database.pool ? true : false,
            server: config.database.server
        }
    });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: '服務器內部錯誤',
        message: config.logging.level === 'debug' ? err.message : '請稍後再試'
    });
});

// 優雅關閉
process.on('SIGINT', async () => {
    console.log('正在關閉服務器...');
    await database.close();
    process.exit(0);
});

// 啟動服務器
app.listen(config.server.port, config.server.host, () => {
    console.log(`🚀 ISPDash API 服務器運行在 http://${config.server.host}:${config.server.port}`);
    console.log(`📊 API 版本: ${config.api.version}`);
    console.log(`🗄️  數據庫: ${config.database.server}/${config.database.database}`);
});

module.exports = { app, database };
