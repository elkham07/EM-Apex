import { LayoutDashboard, Plus, Users, Send, CreditCard, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewTaskModal: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onOpenNewTaskModal }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-task', name: 'New Task', icon: Plus },
    { id: 'members', name: 'Members', icon: Users },
    { id: 'submissions', name: 'Submissions', icon: Send },
    { id: 'payments', name: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="w-68 h-screen border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0c0d0e]/60 flex flex-col justify-between shrink-0 select-none">
      <div className="flex flex-col flex-1 py-6 px-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-indigo-500/10">
            E
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5">
              EM<span className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider scale-90 origin-left">Apex</span>
            </div>
          </div>
        </div>

        {/* Global Launcher action */}
        <button
          onClick={onOpenNewTaskModal}
          id="sidebar-create-task-btn"
          className="w-full py-2.5 px-4 mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>

        {/* Navigation Items */}
        <div className="space-y-6">
          <div>
            <span className="px-3 text-2xs font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
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
                        className="absolute inset-0 bg-neutral-200/50 dark:bg-neutral-800/50 border-l-2 border-indigo-500 dark:border-indigo-400 rounded-xl"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon
                      size={18}
                      className={`relative z-10 ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'
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
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-900/40 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm text-neutral-700 dark:text-neutral-300">
          U
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
            elkhammamedov@gmail.com
          </p>
          <span className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-4xs font-mono font-bold tracking-widest text-emerald-500 dark:text-emerald-400 uppercase">
              Connected
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
