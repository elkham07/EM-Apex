import { useState } from 'react';
import { Send, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  text: string;
  time: string;
}

export default function AdminChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'New high-paying tasks will be dropped at 5PM EST today! Get ready. 🔥', time: '1 hour ago' },
    { id: '2', text: 'All payouts for last week have been processed.', time: 'Yesterday' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      time: 'Just now',
    };
    setMessages([newMessage, ...messages]);
    setInputText('');
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
                  <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-200">Admin</span>
                  <span className="text-[9px] text-neutral-500">{msg.time}</span>
                </div>
                <p className="text-[11px] text-neutral-700 dark:text-neutral-400 mt-0.5 leading-snug bg-neutral-200 dark:bg-neutral-800 p-2 rounded-r-xl rounded-bl-xl">
                  {msg.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type announcement..."
          className="flex-1 bg-transparent text-[11px] outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-500"
        />
        <button
          onClick={handleSend}
          className="w-7 h-7 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center transition-all shrink-0"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}
