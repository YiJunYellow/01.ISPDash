// 數據庫連接模組
const sql = require('mssql');
const config = require('./config');

class Database {
    constructor() {
        this.pool = null;
        this.config = config.database;
    }

    // 連接到數據庫
    async connect() {
        try {
            console.log('正在連接到 SQL Server...');
            console.log('連接配置:', {
                server: this.config.server,
                database: this.config.database,
                user: this.config.user
            });
            
            this.pool = await sql.connect(this.config);
            console.log('✅ 成功連接到 SQL Server');
            
            // 測試連接
            await this.testConnection();
            
            return this.pool;
        } catch (err) {
            console.error('❌ 數據庫連接失敗:', err.message);
            console.error('錯誤代碼:', err.code);
            console.error('錯誤詳情:', err);
            
            this.handleConnectionError(err);
            throw err;
        }
    }

    // 測試數據庫連接
    async testConnection() {
        try {
            const result = await this.pool.request().query('SELECT COUNT(*) as count FROM EquipmentOverview');
            console.log(`✅ 數據庫連接正常，EquipmentOverview 表中有 ${result.recordset[0].count} 條記錄`);
            
            const equipResult = await this.pool.request().query('SELECT TOP 3 * FROM EquipmentOverview');
            console.log('✅ 測試查詢成功，前3條記錄:', equipResult.recordset);
        } catch (err) {
            console.error('❌ 數據庫測試查詢失敗:', err.message);
            throw err;
        }
    }

    // 處理連接錯誤
    handleConnectionError(err) {
        switch (err.code) {
            case 'ELOGIN':
                console.log('💡 請檢查用戶名和密碼是否正確');
                break;
            case 'ESOCKET':
                console.log('💡 請檢查 SQL Server 服務是否運行');
                break;
            case 'ENOTFOUND':
                console.log('💡 請檢查服務器名稱是否正確');
                break;
            case 'ETIMEOUT':
                console.log('💡 連接超時，請檢查網絡或防火牆設置');
                break;
            default:
                console.log('💡 請檢查數據庫配置和網絡連接');
        }
    }

    // 獲取連接池
    async getPool() {
        if (!this.pool) {
            await this.connect();
        }
        return this.pool;
    }

    // 執行查詢
    async query(sqlQuery, params = []) {
        try {
            const pool = await this.getPool();
            const request = pool.request();
            
            // 添加參數
            params.forEach((param, index) => {
                request.input(`param${index}`, param);
            });
            
            const result = await request.query(sqlQuery);
            return result.recordset;
        } catch (err) {
            console.error('查詢執行失敗:', err);
            throw err;
        }
    }

    // 執行存儲過程
    async executeProcedure(procedureName, params = {}) {
        try {
            const pool = await this.getPool();
            const request = pool.request();
            
            // 添加參數
            Object.keys(params).forEach(key => {
                request.input(key, params[key]);
            });
            
            const result = await request.execute(procedureName);
            return result.recordset;
        } catch (err) {
            console.error('存儲過程執行失敗:', err);
            throw err;
        }
    }

    // 關閉連接
    async close() {
        if (this.pool) {
            await this.pool.close();
            console.log('數據庫連接已關閉');
        }
    }
}

// 創建全局數據庫實例
const database = new Database();

module.exports = database;
