// API 服務模組
class ApiService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.endpoints = CONFIG.API_ENDPOINTS;
    }

    // 通用請求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        try {
            if (CONFIG.DEBUG) {
                console.log(`API 請求: ${url}`, options);
            }

            const response = await fetch(url, defaultOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (CONFIG.DEBUG) {
                console.log(`API 回應: ${url}`, data);
            }

            return data;
        } catch (error) {
            console.error(`API 請求失敗: ${url}`, error);
            throw error;
        }
    }

    // 獲取設備總覽
    async getEquipmentOverall() {
        return this.request(this.endpoints.EQP_OVERALL);
    }

    // 獲取設備統計摘要
    async getEquipmentSummary() {
        return this.request(this.endpoints.EQP_SUMMARY);
    }

    // 更新設備狀態
    async updateEquipmentState(equipmentId, state) {
        return this.request(`${this.endpoints.EQP_OVERALL}/${equipmentId}/state`, {
            method: 'PUT',
            body: JSON.stringify({ state })
        });
    }

    // 更新設備警報
    async updateEquipmentAlarm(equipmentId, alarmCount) {
        return this.request(`${this.endpoints.EQP_OVERALL}/${equipmentId}/alarm`, {
            method: 'PUT',
            body: JSON.stringify({ alarmCount })
        });
    }
}

// 創建全局API服務實例
const apiService = new ApiService();
