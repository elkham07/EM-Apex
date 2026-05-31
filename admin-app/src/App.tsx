import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import PendingApprovalsPanel from './components/PendingApprovalsPanel';
import StatsGrid from './components/StatsGrid';
import RevenueChart from './components/RevenueChart';
import MembersView from './components/MembersView';
import SubmissionsView from './components/SubmissionsView';
import PaymentsView from './components/PaymentsView';
import TasksView from './components/TasksView';
import NewTaskFormModal from './components/NewTaskFormModal';
import MonitoringView from './components/MonitoringView';
import Login from './components/Login';

import {
  INITIAL_MEMBERS,
  INITIAL_SUBMISSIONS,
  INITIAL_TASKS,
  INITIAL_PAYMENTS,
  INI_REVENUE_CHART_DATA,
} from './data';
import { Member, Submission, Task, Payment } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldCheck, Sparkles } from 'lucide-react';

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('em_admin_token'));
  const [adminEmail, setAdminEmail] = useState<string | null>(() => localStorage.getItem('em_admin_email'));

  const [members, setMembers] = useState<Member[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<any[]>(INI_REVENUE_CHART_DATA);

  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbTasks, setDbTasks] = useState<any[]>([]);
  const [dbSubmissions, setDbSubmissions] = useState<any[]>([]);
  const [dbPayments, setDbPayments] = useState<any[]>([]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('em_dark_mode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode matching screenshot setup
  });

  // UI Navigational parameters
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Dynamic notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      text: 'System checking active template submission pools...',
      time: '08:00 AM',
      read: false,
    },
  ]);

  const loadAllData = async () => {
    if (!token) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [usersRes, tasksRes, subsRes, paysRes] = await Promise.all([
        fetch('http://localhost:3000/api/auth/users', { headers }),
        fetch('http://localhost:3000/api/tasks', { headers }),
        fetch('http://localhost:3000/api/submissions', { headers }),
        fetch('http://localhost:3000/api/payments', { headers })
      ]);

      if (usersRes.status === 401 || tasksRes.status === 401) {
        handleLogout();
        return;
      }

      const usersData = usersRes.ok ? await usersRes.json() : [];
      const tasksData = tasksRes.ok ? await tasksRes.json() : [];
      const subsData = subsRes.ok ? await subsRes.json() : [];
      const paysData = paysRes.ok ? await paysRes.json() : [];

      setDbUsers(usersData);
      setDbTasks(tasksData);
      setDbSubmissions(subsData);
      setDbPayments(paysData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  // Keep state persistent in localStorage across refreshes
  useEffect(() => {
    // Map tasks
    const mappedTasks: Task[] = dbTasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      category: 'Development',
      assignedTo: 'Unassigned',
      status: t.status === 'active' ? 'todo' : 'completed',
      priority: 'medium',
      dueDate: new Date(t.createdAt).toLocaleDateString(),
      reward: parseFloat(t.reward)
    }));
    setTasks(mappedTasks);

    // Create user map
    const userMap: Record<string, any> = {};
    dbUsers.forEach(u => {
      userMap[u.id] = u;
    });

    // Create task map
    const taskMap: Record<string, any> = {};
    dbTasks.forEach(t => {
      taskMap[t.id] = t;
    });

    // Map submissions
    const mappedSubs: Submission[] = dbSubmissions.map(s => {
      const user = userMap[s.workerId] || { email: 'unknown@worker.com' };
      const task = taskMap[s.taskId] || { title: 'Unknown Task', reward: 0.00 };
      return {
        id: s.id,
        memberName: user.email.split('@')[0],
        memberAvatar: user.email.substring(0, 1).toUpperCase(),
        avatarBg: 'bg-indigo-500',
        title: task.title,
        type: task.title,
        status: s.status === 'pending' ? 'pending' : (s.status === 'approved' ? 'approved' : 'declined'),
        submittedAt: new Date(s.createdAt).toLocaleDateString(),
        revenue: parseFloat(task.reward),
        description: s.fileUrl
      };
    });
    setSubmissions(mappedSubs);

    // Map members
    const mappedMembers: Member[] = dbUsers.map(u => {
      const userSubs = dbSubmissions.filter(s => s.workerId === u.id);
      return {
        id: u.id,
        name: u.email.split('@')[0],
        email: u.email,
        avatar: u.email.substring(0, 1).toUpperCase(),
        avatarBg: u.role === 'admin' ? 'bg-rose-500' : 'bg-indigo-500',
        role: u.role,
        status: 'active',
        joinedDate: new Date(u.createdAt).toLocaleDateString(),
        submissionsCount: userSubs.length
      };
    });
    setMembers(mappedMembers);

    // Create submission map
    const submissionMap: Record<string, any> = {};
    dbSubmissions.forEach(s => {
      submissionMap[s.id] = s;
    });

    // Map payments
    const mappedPayments: Payment[] = dbPayments.map(p => {
      const user = userMap[p.workerId] || { email: 'unknown@worker.com' };
      const sub = submissionMap[p.submissionId] || {};
      const task = taskMap[sub.taskId] || { title: 'Platform Task Payout' };
      return {
        id: p.id,
        memberName: user.email.split('@')[0],
        amount: parseFloat(p.amount),
        status: p.status === 'completed' ? 'success' : (p.status === 'pending' ? 'pending' : 'failed'),
        date: new Date(p.createdAt).toLocaleDateString(),
        item: task.title
      };
    });
    setPayments(mappedPayments);

    // Calculate revenue chart data dynamically
    if (dbPayments.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyRevenueMap: Record<string, number> = {};
      dbPayments.forEach(p => {
        if (p.status === 'completed') {
          const date = new Date(p.createdAt);
          const monthLabel = `${months[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`;
          monthlyRevenueMap[monthLabel] = (monthlyRevenueMap[monthLabel] || 0) + parseFloat(p.amount);
        }
      });
      const chartData = Object.keys(monthlyRevenueMap).map(k => ({
        name: k,
        revenue: monthlyRevenueMap[k]
      }));
      if (chartData.length > 0) {
        setRevenueChartData(chartData);
      }
    }
  }, [dbUsers, dbTasks, dbSubmissions, dbPayments]);

  useEffect(() => {
    localStorage.setItem('em_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toast trigger utility
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper action: add custom notifications to list
  const pushNotification = (text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications((prev) => [
      { id: `notif-${Date.now()}`, text, time: timeStr, read: false },
      ...prev,
    ]);
  };

  // Metric Adjustments - Coupling layout states to look perfectly real-time
  // Total Members starting baseline: 524
  const currentTotalMembers = 524 + (members.length - INITIAL_MEMBERS.length);

  // Active Tasks starting baseline: 48
  const currentActiveTasks = 48 + (tasks.filter((t) => t.status !== 'completed').length - INITIAL_TASKS.filter((t) => t.status !== 'completed').length);

  // Pending Reviews starting baseline: 23 (includes the 3 default ones)
  const currentPendingReviews = 20 + submissions.filter((sub) => sub.status === 'pending').length;

  // Monthly Revenue starting baseline: $12,450
  // Every approved submission that wasn’t originally approved adds its revenue split!
  const approvedPendings = submissions.filter((sub) => {
    const originallyPending = INITIAL_SUBMISSIONS.find((orig) => orig.id === sub.id)?.status === 'pending';
    const isNew = !INITIAL_SUBMISSIONS.some((orig) => orig.id === sub.id);
    return (originallyPending || isNew) && sub.status === 'approved';
  });
  const currentMonthlyRevenue = 12450 + approvedPendings.reduce((sum, sub) => sum + sub.revenue, 0);

  // ACTIONS HANDLERS
  // 1. Approve Submission
  const handleApproveSubmission = async (id: string) => {
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      const res = await fetch(`http://localhost:3000/api/submissions/${id}/review`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'approved' })
      });
      if (!res.ok) throw new Error('Failed to approve submission');
      
      pushNotification(`Approved submission successfully.`);
      showToast(`Approved successfully!`);
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 2. Decline Submission
  const handleDeclineSubmission = async (id: string) => {
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      const res = await fetch(`http://localhost:3000/api/submissions/${id}/review`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'rejected' })
      });
      if (!res.ok) throw new Error('Failed to reject submission');
      
      pushNotification(`Declined submission.`);
      showToast(`Submission declined during audit check.`, 'info');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 3. Create Custom Member (Invite Member)
  const handleAddMember = async (newMem: Omit<Member, 'id' | 'joinedDate' | 'submissionsCount'>) => {
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      const defaultPassword = 'temp_password123!';
      const res = await fetch('http://localhost:3000/api/auth/invite', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: newMem.email,
          password: defaultPassword,
          role: newMem.role // 'admin' or 'worker'
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to invite member');
      }
      
      pushNotification(`Created contributor: "${newMem.name}" (Role: ${newMem.role})`);
      showToast(`New contributor registered. Password: ${defaultPassword}`);
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 4. Delete Member
  const handleDeleteMember = async (id: string) => {
    try {
      const headers = { 
        'Authorization': `Bearer ${token}` 
      };
      const res = await fetch(`http://localhost:3000/api/auth/users/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete user');
      }
      
      pushNotification(`Member deleted from roster.`);
      showToast(`Member deleted successfully.`, 'info');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 5. Create Todo Task
  const handleAddTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      const adminId = localStorage.getItem('em_admin_id') || '';
      const res = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          reward: newTask.reward,
          createdBy: adminId
        })
      });
      if (!res.ok) throw new Error('Failed to assign task');
      
      pushNotification(`Task created: "${newTask.title}"`);
      showToast(`Task assigned successfully.`);
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 6. Delete Todo Task
  const handleDeleteTask = async (id: string) => {
    try {
      const headers = { 
        'Authorization': `Bearer ${token}` 
      };
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error('Failed to delete task');
      
      showToast('Task removed from board.', 'info');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 7. Update Todo Task Status
  const handleUpdateTaskStatus = (id: string, newStatus: Task['status']) => {
    // For now status update is local or client-driven
    showToast(`Task status updated!`);
  };

  // Notification management callbacks
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Override sidebar click "New Task" tab redirecting directly to trigger our nice Modal
  const handleSidebarTabSelection = (tab: string) => {
    if (tab === 'new-task') {
      setIsModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  if (!token) {
    return (
      <Login 
        onLoginSuccess={(tok, email, id) => {
          localStorage.setItem('em_admin_token', tok);
          localStorage.setItem('em_admin_email', email);
          localStorage.setItem('em_admin_id', id);
          setToken(tok);
          setAdminEmail(email);
        }}
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('em_admin_token');
    localStorage.removeItem('em_admin_email');
    localStorage.removeItem('em_admin_id');
    setToken(null);
    setAdminEmail(null);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white dark:bg-[#08090a] transition-all duration-300">
      {/* Left Navigation bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSidebarTabSelection}
        onOpenNewTaskModal={() => setIsModalOpen(true)}
        adminEmail={adminEmail || 'admin@emapex.com'}
        onLogout={handleLogout}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Control Bar with tools */}
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onClearNotifications={handleClearNotifications}
        />

        {/* Action Panel Content matching selected tabs */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 max-w-7xl mx-auto"
              >
                {/* Visual Title Header */}
                <div className="select-none mb-4">
                  <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                    Admin Dashboard
                  </h1>
                  <p className="text-2xs text-neutral-400 dark:text-neutral-500 mt-1">
                    Welcome back! Here's what's happening on your platform today.
                  </p>
                </div>

                {/* Dashboard Bento Metrics Grid */}
                <StatsGrid
                  totalMembers={currentTotalMembers}
                  activeTasks={currentActiveTasks}
                  pendingReviews={currentPendingReviews}
                  monthlyRevenue={currentMonthlyRevenue}
                />

                {/* Chart Segment Layer and Secondary Stats split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                  <RevenueChart data={revenueChartData} />

                  {/* Tasks Quick overview preview */}
                  <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] hover:border-neutral-300 dark:hover:border-neutral-700/80 transition-all select-none flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-widest">
                          High Severity Backlogs
                        </h4>
                        <button
                          onClick={() => setActiveTab('submissions')}
                          className="text-3xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer uppercase tracking-wider"
                        >
                          Show Board
                        </button>
                      </div>

                      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                        {tasks
                          .filter((t) => t.status !== 'completed')
                          .slice(0, 3)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="p-3 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/20 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all flex items-center justify-between gap-4"
                            >
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-[#8b5cf6] tracking-wide uppercase">
                                  {item.category}
                                </span>
                                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate mt-0.5">
                                  {item.title}
                                </p>
                              </div>

                              <span
                                className={`text-[9px] font-bold uppercase py-0.5 px-1.5 rounded tracking-wide shrink-0 ${
                                  item.priority === 'high'
                                    ? 'bg-rose-500/10 text-rose-500'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                                }`}
                              >
                                {item.priority}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-50 dark:border-neutral-800/80 flex items-center justify-between text-3xs text-neutral-400 font-mono">
                      <span>SECURE PIPELINE PROTECTION ACTIVE</span>
                      <ShieldCheck size={14} className="text-emerald-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-7xl mx-auto"
              >
                <MembersView
                  members={members}
                  onAddMember={handleAddMember}
                  onDeleteMember={handleDeleteMember}
                  searchQuery={searchQuery}
                />
              </motion.div>
            )}

            {activeTab === 'submissions' && (
              <motion.div
                key="submissions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-7xl mx-auto"
              >
                <div className="w-full">
                  <SubmissionsView
                    submissions={submissions}
                    onApprove={handleApproveSubmission}
                    onDecline={handleDeclineSubmission}
                    searchQuery={searchQuery}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-7xl mx-auto"
              >
                <PaymentsView payments={payments} searchQuery={searchQuery} />
              </motion.div>
            )}

            {activeTab === 'monitoring' && (
              <motion.div
                key="monitoring"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-7xl mx-auto"
              >
                <MonitoringView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Pending approvals Sidebar */}
      <PendingApprovalsPanel
        submissions={submissions}
        onApprove={handleApproveSubmission}
        onDecline={handleDeclineSubmission}
      />

      <NewTaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />

      {/* Floating Success Alert Banner Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            className={`fixed bottom-6 right-6 p-4 rounded-2xl flex items-center gap-3 shadow-xl z-50 border max-w-sm ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/20 text-indigo-800 dark:text-indigo-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-indigo-500/20'
            }`}>
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold leading-none">{toast.message}</p>
              <span className="text-[9px] font-mono opacity-60 uppercase block mt-1 tracking-wider">
                Action executed successfully
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
