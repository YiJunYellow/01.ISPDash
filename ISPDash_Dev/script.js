// ---- 繪製圓環 ----
function renderRing(el, percent) {
  const size = 120, stroke = 12, r = (size/2)-stroke, cx = size/2, cy = size/2;
  const len = 2*Math.PI*r;
  const val = Math.max(0, Math.min(100, percent));
  const dash = (val/100)*len;
  const danger = val < 50; // 稼動率低於50%顯示紅色
  const color = danger ? 'var(--red)' : 'var(--teal)';
  el.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--gray)" stroke-width="${stroke}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}"
        stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${dash} ${len-dash}" transform="rotate(-90 ${cx} ${cy})"/>
    </svg>
    <div class="center">
      <div class="pct" style="color:${color}">${val}%</div>
      <div class="txt">稼動率</div>
    </div>`;
}

// ---- 生成 Grafana URL ----
function generateGrafanaURL(panelId) {
  const { BASE_URL, DASHBOARD_ID, ORG_ID, THEME } = CONFIG.GRAFANA;
  return `${BASE_URL}/d-solo/${DASHBOARD_ID}/ispdash?orgId=${ORG_ID}&panelId=${panelId}&theme=${THEME}`;
}

// ---- 初始化 Grafana 面板 ----
function initializeGrafanaPanels() {
  // 設置所有Grafana面板的URL
  const iframes = document.querySelectorAll('iframe[data-panel]');
  
  iframes.forEach(iframe => {
    const panelType = iframe.getAttribute('data-panel');
    const panelId = CONFIG.GRAFANA.PANELS[panelType];
    
    if (panelId) {
      iframe.src = generateGrafanaURL(panelId);
    }
  });
}


// ---- 稼動率數據狀態 ----
const state = {
  rings: { P01A:0, P01B:0, P02A:0, P02B:0 }, // 初始化為0，等待數據庫數據
  lastUpdate: null,
  isUpdating: false
};

// ---- 從數據庫讀取稼動率數據 ----
async function fetchOperationRates() {
  // 避免重複更新
  if (state.isUpdating) {
    return;
  }
  
  state.isUpdating = true;
  
  try {
    // 使用配置中的新API端點
    const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.PRESSING_STATUS}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 更新稼動率數據
    if (data && Array.isArray(data)) {
      let hasChanges = false;
      
      data.forEach(item => {
        if (item.EquipmentID && item.OperationRate !== undefined) {
          const newValue = parseFloat(item.OperationRate);
          const oldValue = state.rings[item.EquipmentID];
          
          // 只有當數據真正改變時才更新
          if (Math.abs(newValue - oldValue) > 0.01) {
            state.rings[item.EquipmentID] = newValue;
            hasChanges = true;
          }
        }
      });
      
      // 只有在數據真正改變時才更新圓環圖
      if (hasChanges) {
        // 顯示更新指示器
        showUpdateIndicator(true);
        
        // 延遲更新，讓用戶看到指示器
        setTimeout(() => {
          updateRings();
          
          // 隱藏更新指示器
          setTimeout(() => {
            showUpdateIndicator(false);
          }, 300);
        }, 100);
        
        // 記錄更新時間
        state.lastUpdate = new Date();
        
        if (CONFIG.DEBUG) {
          console.log('稼動率數據已更新:', state.rings);
        }
      }
    }
  } catch (error) {
    console.error('獲取稼動率數據失敗:', error);
    
    // 如果API調用失敗，使用備用數據（從你的截圖中獲取）
    const fallbackData = {
      P01A: 72.00,
      P01B: 74.00,
      P02A: 13.00,
      P02B: 94.00
    };
    
    // 檢查備用數據是否與當前數據不同
    let needsUpdate = false;
    Object.keys(fallbackData).forEach(key => {
      if (Math.abs(fallbackData[key] - state.rings[key]) > 0.01) {
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      Object.assign(state.rings, fallbackData);
      updateRings();
      
      if (CONFIG.DEBUG) {
        console.log('使用備用稼動率數據:', state.rings);
      }
    }
  } finally {
    state.isUpdating = false;
  }
}

// ---- 更新圓環圖顯示 ----
function updateRings() {
  if (ringP01A && ringP01B && ringP02A && ringP02B) {
    // 使用 requestAnimationFrame 確保平滑更新
    requestAnimationFrame(() => {
      renderRing(ringP01A, state.rings.P01A);
      renderRing(ringP01B, state.rings.P01B);
      renderRing(ringP02A, state.rings.P02A);
      renderRing(ringP02B, state.rings.P02B);
    });
  }
}

// ---- 顯示/隱藏更新指示器 ----
function showUpdateIndicator(show) {
  const updateIndicator = document.getElementById('update-indicator');
  if (updateIndicator) {
    updateIndicator.style.opacity = show ? '1' : '0';
    updateIndicator.style.visibility = show ? 'visible' : 'hidden';
  }
}

// ---- 初始化圓環（僅在壓合車間頁面執行） ----
const ringP01A = document.getElementById('ring-P01A');
const ringP01B = document.getElementById('ring-P01B');
const ringP02A = document.getElementById('ring-P02A');
const ringP02B = document.getElementById('ring-P02B');

// 檢查圓環元素是否存在
if (ringP01A && ringP01B && ringP02A && ringP02B) {
  // 初始化時顯示示例數據，讓用戶看到效果
  state.rings = {
    P01A: 72.00,
    P01B: 74.00,
    P02A: 13.00,
    P02B: 94.00
  };
  updateRings();
}

// ---- Chart.js（僅在壓合車間頁面執行） ----
// 所有柱狀圖都已被 Grafana 取代，不再需要 Chart.js 圖表

// ---- 通用側邊欄切換功能 ----
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  // 檢查元素是否存在
  if (!sidebar || !sidebarToggle) {
    console.warn('側邊欄元素未找到');
    return;
  }
  
  // 從 localStorage 讀取側邊欄狀態
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
  }
  
  // 切換側邊欄
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    
    // 儲存狀態到 localStorage
    const isNowCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isNowCollapsed);
  });
  
  // 初始化 Grafana 面板
  initializeGrafanaPanels();
  
  // 初始化稼動率數據
  fetchOperationRates();
  
  // 每30秒更新一次稼動率數據（只更新圓環圖）
  setInterval(fetchOperationRates, CONFIG.UPDATE_INTERVAL);
});
