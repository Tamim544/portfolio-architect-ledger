import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, ChevronRight } from 'lucide-react';
import { useTerminal } from '../hooks/useTerminal';

export const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { logs, executeCommand } = useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 glass p-3 rounded-full hover:bg-primary/20 transition-colors shadow-2xl"
      >
        <TerminalIcon size={24} className="text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 left-6 w-full max-w-md h-[400px] z-50 glass rounded-2xl overflow-hidden flex flex-col shadow-2xl border-primary/20"
          >
            <div className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TerminalIcon size={14} className="text-primary" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">system_terminal_v1.0</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-2 selection:bg-primary/40"
            >
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 ${
                  log.type === 'input' ? 'text-primary' : 
                  log.type === 'error' ? 'text-red-400' : 'text-white/80'
                }`}>
                  <span className="opacity-40">{log.type === 'input' ? '>' : '#'}</span>
                  <span className="whitespace-pre-wrap">{log.content}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2">
              <ChevronRight size={14} className="text-primary animate-pulse" />
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 font-mono text-[11px] text-white"
                placeholder="type help..."
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
