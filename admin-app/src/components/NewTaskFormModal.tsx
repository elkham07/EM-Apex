import React, { useState } from 'react';
import { X, Send, BookOpen, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Submission } from '../types';

interface NewTaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: Omit<Submission, 'id' | 'status' | 'submittedAt'>) => void;
  members: Array<{ name: string; avatar: string; avatarBg: string }>;
}

export default function NewTaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  members,
}: NewTaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [memberName, setMemberName] = useState('');
  const [type, setType] = useState('UI Kit Template');
  const [revenue, setRevenue] = useState(250);
  const [description, setDescription] = useState('');

  // Auto pick corresponding avatar bg
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !memberName) return;

    const matchedMember = members.find((m) => m.name === memberName);
    const memberAvatar = matchedMember ? matchedMember.avatar : '??';
    const avatarBg = matchedMember
      ? matchedMember.avatarBg
      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';

    onSubmit({
      title,
      memberName,
      memberAvatar,
      avatarBg,
      type,
      revenue,
      description,
    });

    // Reset fields
    setTitle('');
    setMemberName('');
    setType('UI Kit Template');
    setRevenue(250);
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/60 dark:bg-neutral-950/80 backdrop-blur-xs"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="bg-white dark:bg-[#121315] border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-20"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-widest flex items-center gap-1.5">
                    <Send size={14} className="text-indigo-500" /> Submit New Asset Resource
                  </h3>
                  <p className="text-2xs text-neutral-400 dark:text-neutral-500 mt-1">
                    Enter submission parameters to append resource directly to the verification pipeline.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form implementation */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Product Title
                  </span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Tailwind SaaS Kit Template v4"
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Creator Contributor
                    </span>
                    <select
                      required
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="">Select a contributor...</option>
                      {members.map((member, i) => (
                        <option key={i} value={member.name}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Asset Type Category
                    </span>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="UI Kit Template">UI Kit Template</option>
                      <option value="Social Media Guide">Social Media Guide</option>
                      <option value="Notion Template Pack">Notion Template Pack</option>
                      <option value="Figma File Bundle">Figma File Bundle</option>
                      <option value="HTML Landing Page">HTML Landing Page</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Payout Payout Value ($)
                    </span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={revenue}
                      onChange={(e) => setRevenue(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-start gap-2 h-[4.5rem] overflow-hidden">
                    <AlertCircle size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-normal">
                      Submission starts as <span className="font-bold text-amber-500 dark:text-amber-400">PENDING</span>. Approving will transfer the payout into Monthly Revenue.
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Product Description Summary
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a quick abstract mapping out the template components..."
                    rows={2}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold cursor-pointer active:scale-98 shadow-md shadow-indigo-500/10 flex items-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>Upload Resource</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
