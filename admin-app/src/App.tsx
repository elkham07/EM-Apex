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
  // State initialization from localStorage or falling back to initial mock datasets
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('em_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('em_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('em_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('em_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [revenueChartData, setRevenueChartData] = useState(() => {
    const saved = localStorage.getItem('em_rev_chart');
    return saved ? JSON.parse(saved) : INI_REVENUE_CHART_DATA;
  });

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
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('em_notifications');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'n-1',
            text: 'System checking active template submission pools...',
            time: '08:00 AM',
            read: false,
          },
        ];
  });

  // Keep state persistent in localStorage across refreshes
  useEffect(() => {
    localStorage.setItem('em_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('em_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('em_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('em_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('em_rev_chart', JSON.stringify(revenueChartData));
  }, [revenueChartData]);

  useEffect(() => {
    localStorage.setItem('em_notifications', JSON.stringify(notifications));
  }, [notifications]);

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
  const handleApproveSubmission = (id: string) => {
    const target = submissions.find((sub) => sub.id === id);
    if (!target) return;

    // Update Submission Status
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: 'approved' } : sub))
    );

    // Register a payout payment automatically
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      memberName: target.memberName,
      amount: target.revenue,
      status: 'success',
      date: new Date().toISOString().split('T')[0],
      item: target.title,
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Append to charts data logic: increase latest revenue marker dynamically!
    setRevenueChartData((prev) => {
      const copy = [...prev];
      if (copy.length > 0) {
        copy[copy.length - 1].revenue += target.revenue;
      }
      return copy;
    });

    // Update member's submissions count
    setMembers((prev) =>
      prev.map((m) =>
        m.name === target.memberName
          ? { ...m, submissionsCount: m.submissionsCount + 1 }
          : m
      )
    );

    pushNotification(`Submission "${target.title}" was approved. Payout of $${target.revenue} registered.`);
    showToast(`Approved successfully! Payout of $${target.revenue} added.`);
  };

  // 2. Decline Submission
  const handleDeclineSubmission = (id: string) => {
    const target = submissions.find((sub) => sub.id === id);
    if (!target) return;

    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: 'declined' } : sub))
    );

    pushNotification(`Submission "${target.title}" was declined during quality review check.`);
    showToast(`Submission declined during audit check.`, 'info');
  };

  // 3. Create Custom Member
  const handleAddMember = (newMem: Omit<Member, 'id' | 'joinedDate' | 'submissionsCount'>) => {
    const member: Member = {
      ...newMem,
      id: `m-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      submissionsCount: 0,
    };
    setMembers((prev) => [member, ...prev]);
    pushNotification(`Added contributor: "${member.name}" (Role: ${member.role})`);
    showToast(`New contributor "${member.name}" registered successfully.`);
  };

  // 4. Delete Member
  const handleDeleteMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;

    setMembers((prev) => prev.filter((m) => m.id !== id));
    pushNotification(`Contributor "${target.name}" removed from roster.`);
    showToast(`Member "${target.name}" deleted.`, 'info');
  };

  // 5. Create Submission (Via New Asset resource modal)
  const handleCreateSubmission = (newSub: Omit<Submission, 'id' | 'status' | 'submittedAt'>) => {
    const submission: Submission = {
      ...newSub,
      id: `sub-${Date.now()}`,
      status: 'pending',
      submittedAt: 'Just Now',
    };
    setSubmissions((prev) => [submission, ...prev]);
    pushNotification(`New submission upload: "${submission.title}" waiting for quality review.`);
    showToast(`Resource submitted to pending queue.`);
  };

  // 6. Create Todo Task
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [task, ...prev]);
    pushNotification(`Task created: "${task.title}" (Priority: ${task.priority})`);
    showToast(`Task assigned successfully.`);
  };

  // 7. Update Todo Task Status (Dragging/Toggling column board states)
  const handleUpdateTaskStatus = (id: string, newStatus: Task['status']) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    pushNotification(`Task "${target.title}" updated status to: ${newStatus === 'completed' ? 'Finished' : newStatus}`);
    showToast(`Task status updated!`);
  };

  // 8. Delete Todo Task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed from board.', 'info');
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

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white dark:bg-[#08090a] transition-all duration-300">
      {/* Left Navigation bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSidebarTabSelection}
        onOpenNewTaskModal={() => setIsModalOpen(true)}
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left listings column */}
                  <div className="lg:col-span-3">
                    <SubmissionsView
                      submissions={submissions}
                      onApprove={handleApproveSubmission}
                      onDecline={handleDeclineSubmission}
                      searchQuery={searchQuery}
                    />
                  </div>

                  {/* Right boards column */}
                  <div className="space-y-6">
                    <TasksView
                      tasks={tasks}
                      onAddTask={handleAddTask}
                      onUpdateTaskStatus={handleUpdateTaskStatus}
                      onDeleteTask={handleDeleteTask}
                    />
                  </div>
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
          </AnimatePresence>
        </div>
      </div>

      {/* Right Pending approvals Sidebar */}
      <PendingApprovalsPanel
        submissions={submissions}
        onApprove={handleApproveSubmission}
        onDecline={handleDeclineSubmission}
      />

      {/* Upload Resource Overlay form popups */}
      <NewTaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmission}
        members={members.map((m) => ({ name: m.name, avatar: m.avatar, avatarBg: m.avatarBg }))}
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
