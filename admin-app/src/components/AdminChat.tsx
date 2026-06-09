import { useState, useEffect, useRef } from 'react';
import { Send, Megaphone, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Announcement {
  id: string;
  text: string;
  sentBy: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString();
}

export default function AdminChat() {
  const [messages, setMessages] = useState<Announcement[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    pollRef.current = setInterval(fetchAnnouncements, 15000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim(), sentBy: 'Admin' }),
      });
      if (res.ok) {
        setInputText('');
        await fetchAnnouncements();
      }
    } catch (err) {
      console.error('Failed to send announcement:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col mt-4 bg-neutral-100 dark:bg-[#121315] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden" style={{ maxHeight: '350px' }}>
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
        <Megaphone size={16} className="text-indigo-500" />
        <div>
          <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50">Announcements</h4>
          <p className="text-[10px] text-neutral-500">Broadcast to all workers</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 size={16} className="text-neutral-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-[11px] text-neutral-500 text-center py-4">No announcements yet</p>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  A
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-200">{msg.sentBy}</span>
                    <span className="text-[9px] text-neutral-500">{timeAgo(msg.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-neutral-700 dark:text-neutral-400 mt-0.5 leading-snug bg-neutral-200 dark:bg-neutral-800 p-2 rounded-r-xl rounded-bl-xl">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type announcement..."
          disabled={sending}
          className="flex-1 bg-transparent text-[11px] outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={sending || !inputText.trim()}
          className="w-7 h-7 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white flex items-center justify-center transition-all shrink-0"
        >
          {sending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
        </button>
      </div>
    </div>
  );
}
