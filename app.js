/* ═══════════════════════════════════════════
   DIGESTO DASHBOARD — app.js
═══════════════════════════════════════════ */

// ─── Data ───────────────────────────────────
const summaries = [
  {
    id: 1,
    type: 'articles',
    emoji: '📱',
    title: 'The First Crucial Hours With the iPhone 15 Pro Max',
    source: 'Medium.com',
    date: '1 day ago',
    reduced: 50,
    before: 102,
    after: 51,
  },
  {
    id: 2,
    type: 'articles',
    emoji: '🎵',
    title: 'Analyzing Spotify\'s new daylist feature: UI, UX, and great ML',
    source: 'Medium.com',
    date: '1 day ago',
    reduced: 93,
    before: 637,
    after: 44,
  },
  {
    id: 3,
    type: 'videos',
    emoji: '🤖',
    title: 'How Google Gemini Changing the Future',
    source: 'Medium.com',
    date: '1 day ago',
    reduced: 70,
    before: 106,
    after: 71,
  },
  {
    id: 4,
    type: 'docs',
    emoji: '📊',
    title: 'Annual Report: AI Market Trends & Forecasts 2024',
    source: 'TechCrunch.com',
    date: '2 days ago',
    reduced: 82,
    before: 480,
    after: 86,
  },
  {
    id: 5,
    type: 'articles',
    emoji: '🔬',
    title: 'MIT Researchers Develop New Neural Interface Chip',
    source: 'news.mit.edu',
    date: '3 days ago',
    reduced: 61,
    before: 215,
    after: 84,
  },
  {
    id: 6,
    type: 'videos',
    emoji: '🚀',
    title: 'SpaceX Starship: Full Integrated Flight Test Breakdown',
    source: 'YouTube.com',
    date: '3 days ago',
    reduced: 78,
    before: 340,
    after: 75,
  },
];

// ─── Reduced badge color helper ──────────────
function reducedColor(pct) {
  if (pct >= 85) return '#ff5c5c';
  if (pct >= 65) return '#ff8c00';
  return '#22c55e';
}

// ─── Render Summaries Table ─────────────────
function renderTable(filter = 'all') {
  const tbody = document.getElementById('summaries-tbody');
  const rows = filter === 'all' ? summaries : summaries.filter(s => s.type === filter);

  tbody.innerHTML = '';

  rows.forEach((item, i) => {
    const color = reducedColor(item.reduced);
    const row = document.createElement('tr');
    row.className = 'sum-row';
    row.style.animationDelay = `${i * 0.06}s`;
    row.style.animation = 'fadeUp .35s ease both';
    row.setAttribute('id', `row-${item.id}`);

    row.innerHTML = `
      <td>
        <div class="resource-cell">
          <div class="resource-thumb" style="font-size:22px">${item.emoji}</div>
          <div>
            <div class="resource-title">${item.title}</div>
            <div class="resource-meta">${item.source} &bull; ${item.date}</div>
          </div>
        </div>
      </td>
      <td style="text-align:center">
        <span class="reduced-badge" style="color:${color}">
          ${item.reduced}%
          <span class="reduced-circle" style="
            width:18px;height:18px;border-radius:50%;display:inline-block;
            background: conic-gradient(${color} 0% ${item.reduced}%, #2a2a2a ${item.reduced}% 100%);
          "></span>
        </span>
      </td>
      <td class="num-cell">
        <span class="num-big">${item.before}</span>
        <span class="num-label">Words</span>
      </td>
      <td class="num-cell">
        <span class="num-big" style="color:${color}">${item.after}</span>
        <span class="num-label">Words</span>
      </td>
    `;

    row.addEventListener('click', () => {
      row.style.background = 'rgba(91,106,255,0.08)';
      setTimeout(() => row.style.background = '', 600);
    });

    tbody.appendChild(row);
  });
}

// ─── Filter Tabs ────────────────────────────
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTable(tab.dataset.tab);
    });
  });
}

// ─── Counter Animation ──────────────────────
function animateCounter(el, target, duration = 1200) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    animateCounter(el, parseInt(el.dataset.target, 10), 1000);
  });

  // Hero count
  const heroCount = document.getElementById('count-anim');
  animateCounter(heroCount, 1543, 1600);
}

// ─── Gauge Canvas ───────────────────────────
function drawGauge(canvas, pct) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H - 10;
  const r = 88;
  const startAngle = Math.PI;
  const endAngle = 0;

  ctx.clearRect(0, 0, W, H);

  // Tick marks background
  const totalTicks = 30;
  for (let i = 0; i <= totalTicks; i++) {
    const angle = Math.PI + (i / totalTicks) * Math.PI;
    const x1 = cx + (r - 12) * Math.cos(angle);
    const y1 = cy + (r - 12) * Math.sin(angle);
    const x2 = cx + (r - 4) * Math.cos(angle);
    const y2 = cy + (r - 4) * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = i / totalTicks <= pct / 100 ? tickColor(i / totalTicks) : '#2a2a2a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Outer arc background
  ctx.beginPath();
  ctx.arc(cx, cy, r - 20, startAngle, endAngle, false);
  ctx.strokeStyle = '#1e1e1e';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Filled arc
  const fillEnd = startAngle + (pct / 100) * Math.PI;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 20, startAngle, fillEnd, false);
  const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grad.addColorStop(0, '#22c55e');
  grad.addColorStop(0.5, '#ff8c00');
  grad.addColorStop(1, '#ff5c5c');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Needle tip dot
  const needleAngle = startAngle + (pct / 100) * Math.PI;
  const nx = cx + (r - 20) * Math.cos(needleAngle);
  const ny = cy + (r - 20) * Math.sin(needleAngle);
  ctx.beginPath();
  ctx.arc(nx, ny, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function tickColor(ratio) {
  if (ratio < 0.4) return '#22c55e';
  if (ratio < 0.7) return '#ff8c00';
  return '#ff5c5c';
}

function animateGauge(canvas, targetPct, labelEl) {
  let current = 0;
  const duration = 1400;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    current = eased * targetPct;
    drawGauge(canvas, current);
    labelEl.textContent = Math.round(current) + '%';
    if (p < 1) requestAnimationFrame(step);
    else {
      drawGauge(canvas, targetPct);
      labelEl.textContent = targetPct + '%';
    }
  };
  requestAnimationFrame(step);
}

// ─── Theme Toggle ───────────────────────────
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const moon = document.getElementById('theme-icon-moon');
  const sun = document.getElementById('theme-icon-sun');
  let light = false;

  btn.addEventListener('click', () => {
    light = !light;
    document.body.classList.toggle('light-theme', light);
    moon.style.display = light ? 'none' : 'block';
    sun.style.display = light ? 'block' : 'none';

    // Redraw gauge with updated colours
    setTimeout(() => {
      const canvas = document.getElementById('gauge-canvas');
      drawGauge(canvas, 68);
    }, 50);
  });
}

// ─── Nav Active State ────────────────────────
function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// ─── Search Highlight ────────────────────────
function initSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('.sum-row').forEach(row => {
      const text = row.querySelector('.resource-title')?.textContent.toLowerCase() || '';
      row.style.opacity = (!q || text.includes(q)) ? '1' : '0.25';
    });
  });
}

// ─── Summarize button ripple ─────────────────
function initSummarizeBtn() {
  const btn = document.getElementById('btn-summarize');
  btn.addEventListener('click', () => {
    btn.textContent = '✓ Added!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        New Summarize
      `;
      btn.style.background = '';
    }, 1800);
  });
}

// ─── Notification popover ────────────────────
function initNotif() {
  const btn = document.getElementById('notif-btn');
  let shown = false;
  let popup = null;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (shown) { popup?.remove(); shown = false; return; }

    popup = document.createElement('div');
    popup.style.cssText = `
      position:fixed; top:64px; right:80px;
      background:#1e1e1e; border:1px solid rgba(255,255,255,0.1);
      border-radius:14px; padding:16px; width:260px;
      box-shadow:0 10px 40px rgba(0,0,0,0.6);
      z-index:1000; animation: fadeUp .2s ease;
      font-family: 'Inter', sans-serif;
    `;
    popup.innerHTML = `
      <p style="font-size:13px;font-weight:700;color:#fff;margin-bottom:10px">Notifications</p>
      <div style="font-size:12px;color:#b0b0b0;display:flex;flex-direction:column;gap:8px">
        <div style="padding:8px;background:#242424;border-radius:8px">📄 New article summarized</div>
        <div style="padding:8px;background:#242424;border-radius:8px">🎵 Spotify summary ready</div>
        <div style="padding:8px;background:#242424;border-radius:8px">⚡ Plan usage at 63%</div>
      </div>
    `;
    document.body.appendChild(popup);
    shown = true;

    document.addEventListener('click', () => { popup?.remove(); shown = false; }, { once: true });
  });
}

// ─── Sources bar animate ─────────────────────
function animateSources() {
  const segs = document.querySelectorAll('.sources-bar-seg');
  segs.forEach(s => {
    const target = s.style.width;
    s.style.width = '0';
    setTimeout(() => { s.style.width = target; }, 300);
  });
}

// ─── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTable('all');
  initTabs();
  initCounters();
  initTheme();
  initNav();
  initSearch();
  initSummarizeBtn();
  initNotif();
  animateSources();

  // Gauge
  const canvas = document.getElementById('gauge-canvas');
  const label = document.getElementById('gauge-pct');
  animateGauge(canvas, 68, label);

  // Upgrade banner
  document.getElementById('upgrade-banner').addEventListener('click', () => {
    document.getElementById('upgrade-banner').style.borderColor = 'var(--accent)';
    document.getElementById('upgrade-banner').style.background = 'rgba(91,106,255,0.1)';
  });
});
