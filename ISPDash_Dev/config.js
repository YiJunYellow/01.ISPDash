// 前端配置文件
const CONFIG = {
    // API 基礎URL
    API_BASE_URL: 'http://localhost:3000',
    
    // API 端點
    API_ENDPOINTS: {
        EQP_OVERALL: '/api/eqp_overview/overall',
        EQP_SUMMARY: '/api/eqp_overview/summary',
        PRESSING_STATUS: '/api/pressing_status'
    },
    
    // Grafana 配置
    GRAFANA: {
        BASE_URL: 'http://localhost:7766',
        DASHBOARD_ID: 'c8548508-1710-4a9e-b580-7881d5f37aeb',
        ORG_ID: 1,
        THEME: 'light',
        // 壓合車間面板配置
        PANELS: {
            VACUUM_CURVE: 1,      // 壓機真空曲線
            TOTAL_PRESSING: 2,    // 壓合總數
            DEFECT_COUNT: 3,      // 壓合不良品
            ALARM_COUNT: 4        // 壓機警報數
        }
    },
    
    // 更新頻率（毫秒）
    UPDATE_INTERVAL: 1000, // 預設1秒
    

    
    // 開發模式
    DEBUG: true
};

// 導出配置（如果使用模組系統）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
