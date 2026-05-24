import React, { useState } from 'react';
import { Submission } from '../types';
import { Filter, Check, X, Search, FileText, DollarSign, Calendar, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmissionsViewProps {
  submissions: Submission[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  searchQuery: string;
}

export default function SubmissionsView({
  submissions,
  onApprove,
  onDecline,
  searchQuery,
}: SubmissionsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  // Filter list of elements based on selections and search filters
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesQuery =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'all') return matchesQuery;
    return matchesQuery && sub.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Control Tools Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#121315] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-neutral-400" />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mr-2">Status</span>
          <div className="flex gap-1.5 bg-neutral-100 dark:bg-neutral-900/60 p-1 rounded-xl">
            {(['all', 'pending', 'approved', 'declined'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-2xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === opt
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="text-3xs text-neutral-400 font-mono font-bold tracking-wider">
          SHOWING {filteredSubmissions.length} OF {submissions.length} ENTRIES
        </div>
      </div>

      {/* Grid listing submissions details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSubmissions.length === 0 ? (
            <div className="col-span-full border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center text-neutral-400 dark:text-neutral-500">
              <p className="text-sm font-semibold">No submissions match the filters</p>
              <span className="text-4xs uppercase tracking-widest block mt-1">Status database cleared</span>
            </div>
          ) : (
            filteredSubmissions.map((sub) => (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] hover:border-neutral-300 dark:hover:border-neutral-700/80 transition-all select-none group flex flex-col justify-between min-h-56"
              >
                <div>
                  {/* Top user row info */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full border flex items-center justify-center font-bold text-xs select-none shrink-0 ${sub.avatarBg}`}
                      >
                        {sub.memberAvatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                          {sub.memberName}
                        </h4>
                        <span className="text-4xs text-neutral-400 dark:text-neutral-500 font-mono block">
                          {sub.submittedAt}
                        </span>
                      </div>
                    </div>

                    {/* Highly aesthetic Status labels matching screenshot colors */}
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        sub.status === 'approved'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : sub.status === 'declined'
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  {/* Template Title Card Row */}
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <FileText size={14} className="text-neutral-400 shrink-0" />
                      <span>{sub.title}</span>
                    </h3>
                    <p className="text-3xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
                      {sub.type}
                    </p>
                    {sub.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer values parameters and actions */}
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-3xs font-mono text-neutral-500">
                    <span className="flex items-center gap-1">
                      <DollarSign size={11} className="text-neutral-400" />
                      Payout: <span className="font-bold text-neutral-800 dark:text-neutral-200">${sub.revenue}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Embedded details button */}
                    <button
                      onClick={() => setSelectedSub(sub)}
                      className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-3xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/40 relative z-10"
                      title="Inspect Submission"
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>

                    {/* Actions controllers on hover or if pending */}
                    {sub.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onApprove(sub.id)}
                          className="w-7 h-7 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                          title="Approve Submission"
                        >
                          <Check size={13} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => onDecline(sub.id)}
                          className="w-7 h-7 bg-rose-500 hover:bg-rose-600 rounded-lg text-white flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                          title="Decline Submission"
                        >
                          <X size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Mini Details Dialog Overlay popup */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#121315] border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-4xs font-mono font-bold uppercase tracking-widest text-[#8b5cf6]">
                      Submission Details
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                      {selectedSub.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSub(null)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className={`w-9 h-9 rounded-full border font-bold text-2xs flex items-center justify-center ${selectedSub.avatarBg}`}>
                      {selectedSub.memberAvatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {selectedSub.memberName}
                      </p>
                      <span className="text-4xs font-mono text-neutral-400">Contributor</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    {selectedSub.description || 'No complementary description details supplied for this template build.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-4xs font-mono font-bold tracking-wider uppercase">
                  <div className="p-3 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                    <span className="text-neutral-400 block">TYPE CATEGORY</span>
                    <span className="text-xs font-sans font-bold text-neutral-800 dark:text-neutral-200 mt-1 block tracking-tight">
                      {selectedSub.type}
                    </span>
                  </div>
                  <div className="p-3 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                    <span className="text-neutral-400 block">Payout revenue</span>
                    <span className="text-xs font-sans font-bold text-emerald-500 mt-1 block tracking-tight">
                      ${selectedSub.revenue}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedSub(null)}
                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer"
                  >
                    Close Inspection
                  </button>
                  {selectedSub.status === 'pending' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          onDecline(selectedSub.id);
                          setSelectedSub(null);
                        }}
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => {
                          onApprove(selectedSub.id);
                          setSelectedSub(null);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
