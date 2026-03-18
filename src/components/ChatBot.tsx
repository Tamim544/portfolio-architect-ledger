import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: input }] }],
        }),
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not answer.';
      const botMsg: Message = { role: 'assistant', content: reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      const errMsg: Message = { role: 'assistant', content: 'Error fetching response.' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-[70vh] bg-background/90 backdrop-blur-md rounded-xl shadow-lg border border-primary/20 glow-pulse flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-primary/10 bg-background/30">
        <h3 className="text-sm font-medium text-gradient">AI Q&A</h3>
        <button onClick={() => setMessages([])} className="text-white/40 hover:text-white transition">
          <Bot size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-primary/20 self-end' : 'bg-background/30 self-start'}`}
            >
              <p className="text-xs text-white/80 break-words">{msg.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2 text-xs text-white/50"
          >
            Thinking...
          </motion.div>
        )}
      </div>
      <div className="flex items-center p-2 border-t border-primary/10 bg-background/30">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
          placeholder="Ask about your portfolio..."
          className="flex-1 bg-transparent outline-none text-sm text-white/80 placeholder:text-white/40"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="ml-2 p-1 text-primary hover:text-primary/80 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
