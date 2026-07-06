import { LayoutDashboard, Plus, Users, Send, CreditCard, ClipboardList, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewTaskModal: () => void;
  adminEmail: string;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onOpenNewTaskModal, adminEmail, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-task', name: 'New Task', icon: Plus },
    { id: 'tasks', name: 'Tasks', icon: ClipboardList },
    { id: 'members', name: 'Members', icon: Users },
    { id: 'submissions', name: 'Submissions', icon: Send },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'monitoring', name: 'Monitoring', icon: Activity },
  ];

  return (
    <div className="w-64 h-screen border-r border-wz-line dark:border-neutral-800 bg-wz-bg-soft dark:bg-[#0c0d0e]/60 flex flex-col justify-between shrink-0 select-none">
      <div className="flex flex-col flex-1 py-6 px-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect width="24" height="24" rx="6" fill="#26332f" />
            <path d="M6 18L18 6M10 18L18 10M6 14L14 6" stroke="#6fa98f" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div>
            <div className="font-serif font-semibold text-base tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-0.5">
              Work<span className="italic font-medium text-wz-sage-deep dark:text-wz-sage">zounds</span>
            </div>
          </div>
        </div>

        {/* Global Launcher action */}
        <button
          onClick={onOpenNewTaskModal}
          id="sidebar-create-task-btn"
          className="w-full py-2.5 px-4 mb-8 bg-wz-ink hover:bg-wz-sage-deep text-[#f4faf7] rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-wz-sage-deep/10 active:scale-98 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>

        {/* Navigation Items */}
        <div className="space-y-6">
          <div>
            <span className="px-3 text-2xs font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase font-mono">
              Admin
            </span>
            <nav className="mt-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left relative ${
                      isActive
                        ? 'text-neutral-900 dark:text-neutral-50'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute inset-0 bg-neutral-200/50 dark:bg-neutral-800/50 border-l-2 border-wz-sage-deep dark:border-wz-sage rounded-xl"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon
                      size={18}
                      className={`relative z-10 ${
                        isActive ? 'text-wz-sage-deep dark:text-wz-sage' : 'text-neutral-400'
                      }`}
                    />
                    <span className="relative z-10">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Footer Identity & Status */}
      <div className="p-4 border-t border-wz-line dark:border-neutral-800/80 bg-wz-bg-soft dark:bg-neutral-900/40 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-wz-sage-deep flex items-center justify-center font-bold text-xs text-white uppercase">
            {adminEmail.substring(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
              {adminEmail}
            </p>
            <span className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-4xs font-mono font-bold tracking-widest text-emerald-500 dark:text-emerald-400 uppercase">
                Connected
              </span>
            </span>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full py-1.5 text-3xs font-bold text-rose-500 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
