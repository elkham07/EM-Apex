import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, Settings, LogOut, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
}

export default function Topbar({
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
}: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#0c0d0e]/80 backdrop-blur-md flex items-center justify-between px-8 z-20">
      {/* Central Search with icon */}
      <div className="relative w-96 max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={16} />
        <input
          type="text"
          placeholder="Search for member, task or submission..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-11 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-neutral-800 dark:text-neutral-100"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Custom Controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggler */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          id="topbar-theme-toggle"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/60 transition-all cursor-pointer"
          title="Toggle UI Theme"
        >
          {darkMode ? <Sun size={18} className="text-amber-400 animate-spin-slow" /> : <Moon size={18} className="text-indigo-600" />}
        </button>

        {/* Dynamic Alerts system with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            id="topbar-notifications-btn"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/60 transition-all cursor-pointer relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-neutral-950" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#121315] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-40 overflow-hidden"
                >
                  <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-50 tracking-wide uppercase flex items-center gap-1.5">
                      <Sparkles size={12} className="text-indigo-500" /> Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={onClearNotifications}
                        className="text-2xs text-indigo-600 dark:text-indigo-400 hover:underline uppercase font-bold tracking-wide cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/85">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-neutral-400 dark:text-neutral-500">
                        <p className="text-xs">No notifications yet.</p>
                        <span className="text-4xs uppercase tracking-widest block mt-1">Status logs empty</span>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900/60 ${
                            !notif.read ? 'bg-indigo-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs text-neutral-700 dark:text-neutral-300">
                              {notif.text}
                            </p>
                            {!notif.read && (
                              <button
                                onClick={() => onMarkNotificationRead(notif.id)}
                                className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                title="Mark as read"
                              >
                                <Check size={10} />
                              </button>
                            )}
                          </div>
                          <span className="text-4xs text-neutral-400 dark:text-neutral-500 block mt-1 font-mono">
                            {notif.time}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/60 transition-all cursor-pointer"
          >
            <Settings size={18} />
          </button>
          
          <AnimatePresence>
            {showSettings && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowSettings(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#121315] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-40 overflow-hidden p-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">A</div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">Admin User</div>
                      <div className="text-xs text-neutral-500">admin@emapex.com</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar badge matching screenshot */}
        <div 
          onClick={() => setShowSettings(!showSettings)}
          className="h-10 w-10 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center bg-indigo-600 text-white font-semibold text-sm select-none shadow-md shadow-indigo-600/10 shrink-0 cursor-pointer"
        >
          A
        </div>
      </div>
    </div>
  );
}
