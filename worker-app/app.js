// 1. Auth Check
const token = localStorage.getItem('token');
const workerId = localStorage.getItem('workerId');

if (!token || !workerId) {
  window.location.href = 'login.html';
}

const API_BASE = 'http://localhost:3000/api';

// 2. Fetch and render Profile
async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE}/profile/${workerId}`);
    if (res.ok) {
      const profile = await res.json();
      document.querySelector('.usage-plan').textContent = `Level: ${profile.level}`;
      document.querySelector('.gauge-sub').textContent = `Earned: $${profile.totalEarnings} | XP: ${profile.xp}`;
      
      const pct = (profile.xp % 1000) / 10; // Assuming 1000 XP per level = 100%
      const canvas = document.getElementById('gauge-canvas');
      const label = document.getElementById('gauge-pct');
      if (canvas && label) {
        animateGauge(canvas, pct, label);
      }
    }
  } catch (err) {
    console.error('Error fetching profile', err);
  }
}

// 3. Fetch and render Tasks
async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (res.ok) {
      const tasks = await res.json();
      const grid = document.querySelector('.tasks-grid');
      
      document.querySelector('.tasks-cards-count').textContent = `${tasks.length} new`;
      
      grid.innerHTML = ''; // clear mock data
      
      tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
          <div class="task-card-header">
            <span class="task-date">Status: ${task.status}</span>
          </div>
          <h4 class="task-title">${task.title}</h4>
          <p style="font-size: 13px; color: #a0a0a0; margin-top: 5px; height: 40px; overflow: hidden;">${task.description}</p>
          <div class="task-card-footer" style="margin-top: 15px;">
            <button class="btn-upgrade-main" onclick="submitTask('${task.id}')" style="padding: 6px 12px; font-size: 12px;">Submit Work</button>
            <span class="task-reward">$${task.reward}</span>
          </div>
        `;
        grid.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Error fetching tasks', err);
  }
}

// 4. Submit Task Logic
window.submitTask = async function(taskId) {
  const fileUrl = prompt("Enter your work URL (e.g., Figma link, GitHub repo, Google Doc):");
  if (!fileUrl) return;

  try {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, workerId, fileUrl })
    });
    
    if (res.ok) {
      alert('Work submitted successfully! Waiting for admin approval. You will receive an email shortly.');
    } else {
      alert('Failed to submit work.');
    }
  } catch (err) {
    console.error('Error submitting task', err);
    alert('Network error.');
  }
}

// Logout
const avatarBtn = document.getElementById('avatar-btn');
if(avatarBtn) {
  avatarBtn.addEventListener('click', () => {
    if (confirm("Do you want to log out?")) {
      localStorage.clear();
      window.location.href = 'login.html';
    }
  });
}

// Gauge Animation (Preserved from original code)
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
    ctx.strokeStyle = i / totalTicks <= pct / 100 ? '#5b6aff' : '#2a2a2a'; // Changed to brand color
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, r - 20, startAngle, endAngle, false);
  ctx.strokeStyle = '#1e1e1e';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  const fillEnd = startAngle + (pct / 100) * Math.PI;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 20, startAngle, fillEnd, false);
  const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grad.addColorStop(0, '#5b6aff');
  grad.addColorStop(1, '#9b51e0');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  const needleAngle = startAngle + (pct / 100) * Math.PI;
  const nx = cx + (r - 20) * Math.cos(needleAngle);
  const ny = cy + (r - 20) * Math.sin(needleAngle);
  ctx.beginPath();
  ctx.arc(nx, ny, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
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

// Init
document.addEventListener('DOMContentLoaded', () => {
  fetchProfile();
  fetchTasks();
});
