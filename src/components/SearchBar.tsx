import React, { useState, useEffect } from 'react';

// Simple debounce implementation to avoid lodash dependency
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  // Debounce the onSearch callback to avoid excessive renders
  const debouncedSearch = React.useMemo(() => debounce(onSearch, 200), [onSearch]);

  useEffect(() => {
    debouncedSearch(value);
  }, [value, debouncedSearch]);

  return (
    <div className="flex items-center gap-2 bg-background/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/20 glow-pulse">
      <input
        type="text"
        placeholder="Search repositories..."
        className="bg-transparent focus:outline-none text-sm text-white placeholder:text-white/40 w-48"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
