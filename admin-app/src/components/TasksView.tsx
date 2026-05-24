import React, { useState } from 'react';
import { Task } from '../types';
import { ClipboardList, PlusCircle, CheckCircle, Clock, RotateCcw, AlertOctagon, Check, Trash2, Tag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTaskStatus: (id: string, newStatus: Task['status']) => void;
  onDeleteTask: (id: string) => void;
}

export default function TasksView({
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
}: TasksViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignedTo, setAssignedTo] = useState('Alex Johnson');
  const [dueDate, setDueDate] = useState('2026-06-01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      description,
      category,
      priority,
      status: 'todo',
      assignedTo,
      dueDate,
    });

    // Reset Form fields
    setTitle('');
    setDescription('');
    setCategory('Development');
    setPriority('medium');
    setAssignedTo('Alex Johnson');
    setDueDate('2026-06-01');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview stats & layout buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#121315] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
          <ClipboardList size={15} /> Board Tasking
        </h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-500/10 active:scale-95 shrink-0"
        >
          <PlusCircle size={14} />
          <span>Add Task Log</span>
        </button>
      </div>

      {/* Task Creation Form Slide Down */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315]"
          >
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-widest">
                Create Actionable Task
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Task Title / Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Code database indexes"
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Development">Development</option>
                    <option value="Design Audit">Design Audit</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Specification Details
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Clear description of key outcomes required..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Severity Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Assigned Owner
                  </label>
                  <input
                    type="text"
                    required
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Contributor's Name"
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95"
                >
                  Confirm Log
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tri-Column Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(['todo', 'in-progress', 'completed'] as const).map((stage) => {
          const stageTasks = tasks.filter((t) => t.status === stage);
          const stageLabels = {
            todo: { name: 'To Do', color: 'border-neutral-200 text-neutral-400 bg-neutral-100/10' },
            'in-progress': { name: 'In Progress', color: 'border-indigo-200 text-indigo-500 bg-indigo-500/5' },
            completed: { name: 'Completed', color: 'border-emerald-200 text-emerald-500 bg-emerald-500/5' },
          };

          return (
            <div key={stage} className="space-y-4">
              {/* Column Header */}
              <div className={`p-3.5 border-b-2 rounded-xl flex items-center justify-between ${stageLabels[stage].color}`}>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {stageLabels[stage].name}
                </span>
                <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {stageTasks.length}
                </span>
              </div>

              {/* Task Cards Column */}
              <div className="space-y-3 min-h-[14rem]">
                <AnimatePresence mode="popLayout">
                  {stageTasks.length === 0 ? (
                    <div className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 text-center text-neutral-400 dark:text-neutral-500">
                      <p className="text-3xs uppercase tracking-widest">No Tasks assigned</p>
                    </div>
                  ) : (
                    stageTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] hover:border-neutral-300 dark:hover:border-neutral-700/80 transition-all shadow-xs relative group flex flex-col justify-between"
                      >
                        <div>
                          {/* Heading Priority Row */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-4xs font-mono text-neutral-400 font-bold uppercase flex items-center gap-1">
                              <Tag size={9} /> {task.category}
                            </span>
                            <span
                              className={`text-4xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                task.priority === 'high'
                                  ? 'bg-rose-500/10 text-rose-500'
                                  : task.priority === 'medium'
                                  ? 'bg-indigo-500/10 text-indigo-500'
                                  : 'bg-neutral-500/10 text-neutral-400'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {/* Info Rows */}
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 mt-2.5 leading-snug">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-3xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Footer details row */}
                        <div className="mt-4 pt-3.5 border-t border-neutral-50 dark:border-neutral-800/60 flex items-center justify-between">
                          <span className="text-4xs font-mono text-neutral-500 select-all font-semibold">
                            BY: {task.assignedTo}
                          </span>

                          <div className="flex items-center gap-1.5 relative z-10">
                            {/* Controls buttons to transition task state */}
                            {stage !== 'todo' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'todo')}
                                className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 transition-all cursor-pointer"
                                title="Demote to ToDo"
                              >
                                <RotateCcw size={10} />
                              </button>
                            )}
                            {stage !== 'in-progress' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'in-progress')}
                                className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer"
                                title="Move to In-Progress"
                              >
                                <Clock size={10} />
                              </button>
                            )}
                            {stage !== 'completed' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                                className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer"
                                title="Complete Task"
                              >
                                <Check size={10} />
                              </button>
                            )}
                            {/* Trash button */}
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1 rounded hover:bg-rose-500/10 hover:text-rose-500 text-neutral-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                              title="Delete Task Log"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
