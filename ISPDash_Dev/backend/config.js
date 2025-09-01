// 後端配置文件
const config = {
    // 服務器配置
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            credentials: true
        }
    },

    // 數據庫配置
    database: {
        user: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || 'Test123!',
        database: process.env.DB_NAME || 'ISPDash',
        server: process.env.DB_SERVER || 'localhost\\ISPDASH',
        port: process.env.DB_PORT || 1433,
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
    },

    // API 配置
    api: {
        version: '1.0.0',
        prefix: '/api',
        endpoints: {
            // 設備總覽相關
            eqpOverview_Overall: '/eqp_overview/overall',
            eqpOverview_Summary: '/eqp_overview/summary',
            eqpOverview_Single: '/eqp_overview/overall/:id',
            eqpOverview_UpdateState: '/eqp_overview/overall/:id/state',
            eqpOverview_UpdateAlarm: '/eqp_overview/overall/:id/alarm',
            
            // 壓合狀態相關
            pressingStatus_All: '/pressing_status',
            pressingStatus_Single: '/pressing_status/:equipmentId',
            pressingStatus_Update: '/pressing_status/:equipmentId'
        }
    },

    // 日誌配置
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        enableConsole: true,
        enableFile: false
    },

    // 安全配置
    security: {
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15分鐘
            max: 100 // 限制每個IP 15分鐘內最多100個請求
        }
    }
};

module.exports = config;
