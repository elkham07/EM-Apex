import { Submission } from '../types';
import { Check, X, CheckSquare, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminChat from './AdminChat';

interface PendingApprovalsPanelProps {
  submissions: Submission[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function PendingApprovalsPanel({
  submissions,
  onApprove,
  onDecline,
}: PendingApprovalsPanelProps) {
  const pendingItems = submissions.filter((sub) => sub.status === 'pending');

  return (
    <div className="w-80 h-full border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0c0d0e]/40 py-6 px-4 flex flex-col justify-between shrink-0 select-none overflow-hidden">
      <div>
        {/* Header Title Section */}
        <div className="px-2 mb-6">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            Pending Approvals
          </h3>
          <p className="text-2xs text-neutral-400 dark:text-neutral-500 mt-1 font-medium flex items-center gap-1">
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">
              {pendingItems.length}
            </span>{' '}
            submissions waiting for review
          </p>
        </div>

        {/* Dynamic Interactive List Card */}
        <div className="space-y-3 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {pendingItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center text-neutral-400 dark:text-neutral-500"
              >
                <CheckSquare size={24} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                <p className="text-xs font-semibold">All caught up!</p>
                <p className="text-4xs uppercase tracking-widest mt-1">Ready for next submissions</p>
              </motion.div>
            ) : (
              pendingItems.map((sub, index) => (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="p-3.5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121315] hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md dark:hover:shadow-indigo-500/2 transition-all relative group flex items-center justify-between gap-3"
                >
                  {/* Left Bio info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-10 w-10 rounded-full border flex items-center justify-center font-bold text-xs select-none shrink-0 ${sub.avatarBg}`}
                    >
                      {sub.memberAvatar}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                        {sub.memberName}
                      </h4>
                      <p className="text-4xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate uppercase tracking-wider">
                        {sub.type}
                      </p>
                    </div>
                  </div>

                  {/* Actions Approvals Controls matches exact screenshot colors */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onApprove(sub.id)}
                      className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm shadow-emerald-500/10 active:scale-90"
                      title="Approve Submission"
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => onDecline(sub.id)}
                      className="w-7 h-7 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm shadow-rose-500/10 active:scale-90"
                      title="Decline Submission"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Announcement Chat */}
      <AdminChat />
    </div>
  );
}
