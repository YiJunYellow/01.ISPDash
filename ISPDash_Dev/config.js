// 前端配置文件
const CONFIG = {
    // API 基礎URL
    API_BASE_URL: 'http://localhost:3000',
    
    // API 端點
    API_ENDPOINTS: {
        EQP_OVERALL: '/api/eqp_overview/overall',
        EQP_SUMMARY: '/api/eqp_overview/summary'
    },
    
    // Grafana 配置
    GRAFANA: {
        BASE_URL: 'http://localhost:7766',
        DASHBOARD_ID: 'df908cf3-da81-4901-9759-e57f9a1dc5d4',
        PANEL_ID: 1,
        ORG_ID: 1,
        REFRESH_INTERVAL: '5s',
        THEME: 'light'
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
