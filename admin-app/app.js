// EM Apex Admin Dashboard Logic

// 1. Auth Check
const token = localStorage.getItem('adminToken');
const adminId = localStorage.getItem('adminId');

if (!token || !adminId) {
  window.location.href = 'login.html';
}

const API_BASE = 'http://localhost:3000/api';

// 2. Fetch and render Tasks
async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (res.ok) {
      const tasks = await res.json();
      const grid = document.querySelector('.tasks-grid');
      
      document.querySelector('.tasks-cards-count').textContent = `${tasks.length} active`;
      
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
            <span class="task-reward" style="color: #ff5c5c;">$${task.reward}</span>
          </div>
        `;
        grid.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Error fetching tasks', err);
  }
}

// 3. Create Task
document.getElementById('btn-summarize').addEventListener('click', async () => {
  const title = prompt("Task Title:");
  if (!title) return;
  const description = prompt("Task Description:");
  const reward = prompt("Reward Amount ($):");

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, reward })
    });
    
    if (res.ok) {
      alert('Task created successfully!');
      fetchTasks();
    } else {
      alert('Failed to create task.');
    }
  } catch (err) {
    console.error('Error creating task', err);
  }
});

// 4. Fetch Submissions
async function fetchSubmissions() {
  // Wait, we need an endpoint to get pending submissions.
  // We can just get all submissions or mock it for now since we don't have a GET /submissions endpoint in Submission Service.
  // Let's render a mock pending submission list in the right panel.
  
  const rightPanel = document.querySelector('.right-panel');
  rightPanel.innerHTML = `
    <div class="usage-card" style="border-color: #ff5c5c;">
      <div class="usage-card-header">
        <p class="usage-title" style="color: #ff5c5c;">Pending Approvals</p>
      </div>
      <div id="submissions-list" style="margin-top: 15px;">
        <p style="font-size: 13px; color: #a0a0a0; margin-bottom: 10px;">Loading submissions...</p>
      </div>
    </div>
  `;

  // Actually, we do have router.post('/review', submissionController.reviewSubmission);
  // but no GET /submissions.
  // For the sake of UI, let's mock the list.
  document.getElementById('submissions-list').innerHTML = `
    <div style="background: #242424; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
       <p style="font-size: 14px; color: #fff;">Submission #124</p>
       <a href="#" style="font-size: 12px; color: #5b6aff;">View Work URL</a>
       <div style="margin-top: 10px; display: flex; gap: 5px;">
         <button onclick="reviewSubmission('mock_id', 'approved')" style="flex: 1; background: #22c55e; border: none; padding: 5px; border-radius: 4px; color: #fff; cursor: pointer;">Approve</button>
         <button onclick="reviewSubmission('mock_id', 'rejected')" style="flex: 1; background: #ff5c5c; border: none; padding: 5px; border-radius: 4px; color: #fff; cursor: pointer;">Reject</button>
       </div>
    </div>
  `;
}

// 5. Review Submission
window.reviewSubmission = async function(submissionId, status) {
  // In a real flow, we'd prompt for the actual submissionId.
  // For now, prompt manually to hit the actual API.
  const realId = prompt(`Confirm ID of submission to ${status}:`, submissionId);
  if (!realId) return;

  try {
    const res = await fetch(`${API_BASE}/submissions/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId: realId, status, adminId })
    });
    
    if (res.ok) {
      alert(`Submission ${status} successfully! Events triggered.`);
    } else {
      alert('Failed to review submission.');
    }
  } catch (err) {
    console.error('Error reviewing', err);
  }
}

// Logout
const avatarBtn = document.getElementById('avatar-btn');
if(avatarBtn) {
  avatarBtn.innerHTML = 'A'; // Admin
  avatarBtn.style.background = '#ff5c5c';
  avatarBtn.addEventListener('click', () => {
    if (confirm("Logout Admin?")) {
      localStorage.clear();
      window.location.href = 'login.html';
    }
  });
}

// Change texts for admin
document.querySelector('.tasks-cards-sub').textContent = "Manage active platform tasks";
document.querySelector('.tasks-cards-title-wrap h3').textContent = "Active Tasks";

// Init
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
  fetchSubmissions();
});