import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  // Initialize theme from localStorage or default to 'dark'
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors glow-pulse p-2 rounded"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
      {isDark ? 'Dark' : 'Light'}
    </button>
  );
};
