import React from 'react';

interface ParticleSettingsProps {
  style: 'dots' | 'lines' | 'nebula';
  setStyle: (s: 'dots' | 'lines' | 'nebula') => void;
  count: number;
  setCount: (c: number) => void;
}

export const ParticleSettings: React.FC<ParticleSettingsProps> = ({ style, setStyle, count, setCount }) => {
  return (
    <div className="absolute top-4 left-4 flex items-center gap-3 z-20 bg-background/30 backdrop-blur-sm rounded-lg p-2 border border-primary/20 glow-pulse">
      <label className="text-xs text-white/70">Style:</label>
      <select
        value={style}
        onChange={e => setStyle(e.target.value as 'dots' | 'lines' | 'nebula')}
        className="bg-transparent text-white/80 border-b border-white/30 focus:outline-none"
      >
        <option value="dots">Dots</option>
        <option value="lines">Lines</option>
        <option value="nebula">Nebula</option>
      </select>
      <label className="text-xs text-white/70 ml-2">Count:</label>
      <input
        type="number"
        min={10}
        max={200}
        value={count}
        onChange={e => setCount(Math.max(10, Math.min(200, Number(e.target.value))))}
        className="w-16 bg-transparent text-white/80 border-b border-white/30 focus:outline-none"
      />
    </div>
  );
};
