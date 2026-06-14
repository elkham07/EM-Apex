import React, { useState } from 'react';
import { X, Send, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import { apiUrl } from '../lib/api';

interface NewTaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  token: string | null;
}

export default function NewTaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  token,
}: NewTaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [revenue, setRevenue] = useState(250);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [deadline, setDeadline] = useState('1 Hour');
  const [uploading, setUploading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || uploading) return;

    setUploading(true);
    let uploadedFileUrl = '';

    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch(apiUrl('/api/tasks/upload'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload task plan PDF brief');
        }

        const uploadData = await uploadRes.json();
        uploadedFileUrl = uploadData.fileUrl;
      }

      onSubmit({
        title,
        description,
        category: 'General',
        assignedTo: 'All',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        reward: revenue,
        file: uploadedFileUrl,
        deadline: deadline
      } as any);

      // Reset fields
      setTitle('');
      setRevenue(250);
      setDescription('');
      setFileName('');
      setFile(null);
      setDeadline('1 Hour');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error occurred while creating task');
    } finally {
      setUploading(false);
    }
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
                    <Send size={14} className="text-indigo-500" /> CREATE NEW WORKER TASK
                  </h3>
                  <p className="text-2xs text-neutral-400 dark:text-neutral-500 mt-1">
                    Enter details to publish a new task to the worker dashboard.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  disabled={uploading}
                  className="p-1 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form implementation */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    TASK TITLE
                  </span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={uploading}
                    placeholder="e.g. Tailwind SaaS Kit Template v4"
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                      REWARD VALUE ($)
                    </span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={revenue}
                      onChange={(e) => setRevenue(Number(e.target.value))}
                      disabled={uploading}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                      TASK DEADLINE LIMIT
                    </span>
                    <select
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      disabled={uploading}
                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="1 Hour">1 Hour</option>
                      <option value="5 Hours">5 Hours</option>
                      <option value="1 Day">1 Day</option>
                      <option value="3 Days">3 Days</option>
                      <option value="1 Week">1 Week</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Upload Task Plan / PDF Brief (PDF only)
                  </span>
                  {!fileName ? (
                    <label className="flex flex-col items-center justify-center w-full h-[4.5rem] border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl cursor-pointer bg-neutral-50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400"><span className="font-semibold text-indigo-500">Click to upload</span> or drag and drop</p>
                        <p className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-0.5">PDF (MAX. 10MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const fileObj = e.target.files[0];
                            setFile(fileObj);
                            setFileName(fileObj.name);
                          }
                        }} 
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between w-full h-[4.5rem] px-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/40">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileSpreadsheet size={16} className="text-indigo-500 shrink-0" />
                        <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate">{fileName}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setFileName('');
                          setFile(null);
                        }} 
                        disabled={uploading}
                        className="p-1 hover:bg-rose-500/10 text-rose-500 rounded transition-colors shrink-0 disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    TASK GUIDELINES & DESCRIPTION
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={uploading}
                    placeholder="Provide a quick abstract mapping out the template components..."
                    rows={2}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none disabled:opacity-50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={uploading}
                    className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold cursor-pointer active:scale-98 shadow-md shadow-indigo-500/10 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Uploading Plan...</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>Publish Task</span>
                      </>
                    )}
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
