// 顯示右上時間（yyyy.MM.dd HH:mm:ss）
function fmt2(n){ return n<10 ? '0'+n : ''+n; }
function tickClock(){
  const d = new Date();
  const s = `${d.getFullYear()}.${fmt2(d.getMonth()+1)}.${fmt2(d.getDate())} `
          + `${fmt2(d.getHours())}:${fmt2(d.getMinutes())}:${fmt2(d.getSeconds())}`;
  const el = document.getElementById('equipTime');
  if (el) el.textContent = s;
}
setInterval(tickClock, 1000); tickClock();

// 從API服務獲取設備數據
async function fetchEquipmentData() {
  try {
    console.log('正在獲取設備數據...');
    const data = await apiService.getEquipmentOverall();
    console.log('獲取到的設備數據:', data);
    return data;
  } catch (error) {
    console.error('獲取設備數據失敗:', error);
    return [];
  }
}

// 獲取設備統計摘要
async function fetchEquipmentSummary() {
  try {
    console.log('正在獲取設備統計...');
    const data = await apiService.getEquipmentSummary();
    console.log('獲取到的設備統計:', data);
    return data;
  } catch (error) {
    console.error('獲取設備統計失敗:', error);
    return { RUN: 0, IDLE: 0, DOWN: 0 };
  }
}

// 更新設備卡片顯示
function updateEquipmentCards(equipmentList) {
  const grid = document.getElementById('equipGrid');
  if (!grid) return;

  // 清空現有內容
  grid.innerHTML = '';

  equipmentList.forEach(equipment => {
    const card = createEquipmentCard(equipment);
    grid.appendChild(card);
  });
}

// 創建設備卡片
function createEquipmentCard(equipment) {
  const article = document.createElement('article');
  article.className = `equip-tile ${equipment.EquipmentState.toLowerCase()}`;
  article.setAttribute('data-eqpid', equipment.EquipmentID);

  article.innerHTML = `
    <div class="tile-head">
      <span class="eqpid">${equipment.EquipmentID}</span>
      <span class="eqptype">${equipment.EquipmentType}</span>
    </div>
    <div class="tile-body">
      <div>ME：${equipment.MEName || '未分配'}</div>
      <div>OP：${equipment.OPName || '未分配'}</div>
      <div>狀態：${equipment.EquipmentState}</div>
      <div>達成率：${equipment.CompletionRate}%</div>
      <div>警報數：${equipment.AlarmCount.toString().padStart(2, '0')}</div>
      <div>生產時間：${equipment.ProductionTime}Min</div>
    </div>
  `;

  return article;
}

// 初始化設備數據
async function initializeEquipmentData() {
  const equipmentList = await fetchEquipmentData();
  updateEquipmentCards(equipmentList);
}

// 定期更新設備數據
async function updateEquipmentData() {
  const equipmentList = await fetchEquipmentData();
  updateEquipmentCards(equipmentList);
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
  initializeEquipmentData();
  // 使用配置的更新頻率
  setInterval(updateEquipmentData, CONFIG.UPDATE_INTERVAL);
});
