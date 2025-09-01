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
        REFRESH_INTERVAL: '5s',
        // 壓合車間面板配置
        PANELS: {
            VACUUM_CURVE: 1,      // 壓機真空曲線
            TOTAL_PRESSING: 2,    // 壓合總數
            DEFECT_COUNT: 3,      // 壓合不良品
            ALARM_COUNT: 4        // 壓機警報數
        },
        
        // 生成面板 URL
        getPanelUrl: function(panelId) {
            return `${this.BASE_URL}/d-solo/${this.DASHBOARD_ID}/ispdash?orgId=${this.ORG_ID}&refresh=${this.REFRESH_INTERVAL}&theme=${this.THEME}&panelId=${panelId}`;
        },
        
        // 获取面板的完整 iframe 配置
        getPanelConfig: function(panelId, width = '100%', height = 200) {
            return {
                src: this.getPanelUrl(panelId),
                width: width,
                height: height,
                frameborder: 0
            };
        },
        
        // 获取所有面板的配置
        getAllPanelsConfig: function() {
            return {
                VACUUM_CURVE: this.getPanelConfig(1, '100%', 200),      // 壓機真空曲線
                TOTAL_PRESSING: this.getPanelConfig(2, '100%', 200),     // 壓合總數
                DEFECT_COUNT: this.getPanelConfig(3, '100%', 200),       // 壓合不良品
                ALARM_COUNT: this.getPanelConfig(4, '100%', 200)         // 壓機警報數
            };
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
