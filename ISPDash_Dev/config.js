// 前端配置文件
const CONFIG = {
    // API 基礎URL
    API_BASE_URL: 'http://localhost:3000',
    
    // API 端點
    API_ENDPOINTS: {
        EQP_OVERALL: '/api/eqp_overview/overall',
        EQP_SUMMARY: '/api/eqp_overview/summary'
    },
    
    // 更新頻率（毫秒）
    UPDATE_INTERVAL: 30000,
    
    // 開發模式
    DEBUG: true
};

// 導出配置（如果使用模組系統）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
