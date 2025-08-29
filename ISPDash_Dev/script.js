// ---- 繪製圓環 ----
function renderRing(el, percent) {
  const size = 120, stroke = 12, r = (size/2)-stroke, cx = size/2, cy = size/2;
  const len = 2*Math.PI*r;
  const val = Math.max(0, Math.min(100, percent));
  const dash = (val/100)*len;
  const danger = val < 30;
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

// ---- 假資料 ----
const state = {
  rings: { P01A:72, P01B:74, P02A:13, P02B:94 },
  total: { labels:['P01A','P01B','P02A','P02B'], data:[260,220,80,310] },
  defect:{ labels:['P01A','P01B','P02A','P02B'], data:[12,14,96,15] },
  alarm: { labels:['P01A','P01B','P02A','P02B'], data:[1,1,8,1] },
  line: {
    labels:['11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30'],
    series:{
      P01A:[4,3,2,4,7,8,5,6],
      P01B:[1,2,3,4,6,6,3,2],
      P02A:[0.5,1.2,2.1,3.9,5.1,6.2,4.8,1.9],
      P02B:[3.4,2.3,1.8,3.5,4.4,5.7,4.1,3.9]
    }
  }
};

// ---- 初始化圓環（僅在壓合車間頁面執行） ----
const ringP01A = document.getElementById('ring-P01A');
const ringP01B = document.getElementById('ring-P01B');
const ringP02A = document.getElementById('ring-P02A');
const ringP02B = document.getElementById('ring-P02B');

if (ringP01A && ringP01B && ringP02A && ringP02B) {
  renderRing(ringP01A, state.rings.P01A);
  renderRing(ringP01B, state.rings.P01B);
  renderRing(ringP02A, state.rings.P02A);
  renderRing(ringP02B, state.rings.P02B);
}

// ---- Chart.js（僅在壓合車間頁面執行） ----
const barTotal = document.getElementById('barTotal');
const barDefect = document.getElementById('barDefect');
const barAlarm = document.getElementById('barAlarm');
const lineVacuum = document.getElementById('lineVacuum');

if (barTotal && barDefect && barAlarm && lineVacuum) {
  const barOpt = {
    responsive:true,
    maintainAspectRatio:false,   // 允許自訂高度
    plugins:{legend:{display:false}},
    scales:{y:{beginAtZero:true}}
  };
  
  new Chart(barTotal, {
    type:'bar',
    data:{labels:state.total.labels,datasets:[{data:state.total.data,backgroundColor:'#59C3B0'}]},
    options:barOpt
  });
  
  new Chart(barDefect, {
    type:'bar',
    data:{labels:state.defect.labels,datasets:[{data:state.defect.data,backgroundColor:'#E53935'}]},
    options:barOpt
  });
  
  new Chart(barAlarm, {
    type:'bar',
    data:{labels:state.alarm.labels,datasets:[{data:state.alarm.data,backgroundColor:'#0B6FA4'}]},
    options:barOpt
  });
  
  new Chart(lineVacuum, {
    type:'line',
    data:{
      labels:state.line.labels,
      datasets:[
        {label:'P01A', data:state.line.series.P01A},
        {label:'P01B', data:state.line.series.P01B},
        {label:'P02A', data:state.line.series.P02A},
        {label:'P02B', data:state.line.series.P02B}
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,  // 允許高度依 CSS
      plugins:{legend:{position:'right'}},
      scales:{y:{beginAtZero:true}}
    }
  });
}

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
});
