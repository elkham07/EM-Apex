import { Users, ClipboardList, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsGridProps {
  totalMembers: number;
  activeTasks: number;
  pendingReviews: number;
  monthlyRevenue: number;
  totalMembersChange?: string;
  activeTasksChange?: string;
  pendingReviewsChange?: string;
}

export default function StatsGrid({
  totalMembers,
  activeTasks,
  pendingReviews,
  monthlyRevenue,
  totalMembersChange = '+0',
  activeTasksChange = '+0',
  pendingReviewsChange = '+0',
}: StatsGridProps) {
  const stats = [
    {
      id: 'stat-members',
      label: 'Total Members',
      val: totalMembers.toLocaleString(),
      change: totalMembersChange,
      isUp: !totalMembersChange.startsWith('-'),
      icon: Users,
      color: 'from-blue-500/10 to-transparent text-blue-500 border-blue-500/10 dark:border-blue-500/20',
      textColor: 'text-blue-500 dark:text-blue-400',
    },
    {
      id: 'stat-tasks',
      label: 'Active Tasks',
      val: activeTasks,
      change: activeTasksChange,
      isUp: !activeTasksChange.startsWith('-'),
      icon: ClipboardList,
      color: 'from-emerald-500/10 to-transparent text-emerald-500 border-emerald-500/10 dark:border-emerald-500/20',
      textColor: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      id: 'stat-reviews',
      label: 'Pending Reviews',
      val: pendingReviews,
      change: pendingReviewsChange,
      isUp: !pendingReviewsChange.startsWith('-'),
      icon: AlertCircle,
      color: 'from-orange-500/10 to-transparent text-orange-500 border-orange-500/10 dark:border-orange-500/20',
      textColor: 'text-orange-500 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="p-5 border border-wz-line dark:border-neutral-800 rounded-2xl bg-wz-bg dark:bg-[#121315] hover:border-wz-sage dark:hover:border-neutral-700/80 transition-all select-none group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-wz-ink-soft dark:text-neutral-500 uppercase tracking-widest font-mono">
                {item.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border bg-gradient-to-br ${item.color}`}
              >
                <Icon size={16} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-sans tracking-tight text-wz-ink dark:text-neutral-50">
                {item.val}
              </span>
              {/* Green active status tags matching screenshot */}
              <span className="text-2xs flex items-center gap-0.5 bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-md">
                <TrendingUp size={10} />
                <span>{item.change}</span>
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
