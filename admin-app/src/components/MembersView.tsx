import React, { useState } from 'react';
import { Member } from '../types';
import { Search, UserPlus, Filter, Trash2, Mail, Briefcase, Calendar, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MembersViewProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id' | 'joinedDate' | 'submissionsCount'>) => void;
  onDeleteMember: (id: string) => void;
  searchQuery: string;
}

export default function MembersView({
  members,
  onAddMember,
  onDeleteMember,
  searchQuery,
}: MembersViewProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Product Designer');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Filter members by query and state
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && member.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Create unique dynamic visual tag backgrounds for user profiles
    const bgs = [
      'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'bg-amber-500/10 text-amber-400 border-amber-500/30',
      'bg-rose-500/10 text-rose-400 border-rose-400/30',
      'bg-purple-500/10 text-purple-400 border-purple-400/30',
    ];
    const pickedBg = bgs[Math.floor(Math.random() * bgs.length)];
    const avatar = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    onAddMember({
      name,
      email,
      role,
      status,
      avatar,
      avatarBg: pickedBg,
    });

    // Reset Form state
    setName('');
    setEmail('');
    setRole('Product Designer');
    setStatus('active');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header with Search/Filter Tools */}
      <div className="flex flex-col sm:flex-row items-center justify-start gap-4 bg-white dark:bg-[#121315] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-neutral-400" />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mr-2">Filters</span>
          <div className="flex gap-1.5 bg-neutral-100 dark:bg-neutral-900/60 p-1 rounded-xl">
            {(['all', 'active', 'inactive'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-2xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filter === opt
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Member Slide Transition Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315]"
          >
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-widest">
                  Create Platform Contributor
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Neeson"
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="liam@example.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Assigned Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Product Designer">Product Designer</option>
                    <option value="UI Developer">UI Developer</option>
                    <option value="Template Architect">Template Architect</option>
                    <option value="No-Code Expert">No-Code Expert</option>
                    <option value="Content Creator">Content Creator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Active Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95"
                >
                  Confirm Creation
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid List representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center text-neutral-400 dark:text-neutral-500">
              <p className="text-sm font-semibold">No members found matching filters</p>
              <span className="text-4xs uppercase tracking-widest block mt-1">Try resetting name criteria</span>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] hover:border-neutral-300 dark:hover:border-neutral-700/80 transition-all select-none relative group flex flex-col justify-between h-48"
              >
                {/* Header profile cards layout */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-full border flex items-center justify-center font-bold text-sm select-none shrink-0 ${member.avatarBg}`}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {member.name}
                      </h4>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  {/* Actions Trash Button to delete contributor */}
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="p-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete Contributor"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Sub Metadata rows inside cards */}
                <div className="mt-4 flex flex-col gap-1.5 text-[11px] font-mono font-medium tracking-wide">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 w-12">EMAIL:</span>
                    <span className="text-neutral-700 dark:text-neutral-300 truncate">
                      {member.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 w-12">JOINED:</span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {member.joinedDate}
                    </span>
                  </div>
                </div>

                {/* Footer counters and status controls safely padded */}
                <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                  <div className="text-[10px] text-neutral-500 font-medium">
                    Submissions: <span className="font-bold text-neutral-800 dark:text-neutral-100">{member.submissionsCount}</span>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      member.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-neutral-500/10 text-neutral-400'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
