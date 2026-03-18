import React from 'react';
import { motion } from 'framer-motion';

const milestones = [
  { year: '2020', title: 'Started coding', description: 'First projects and learning JavaScript.' },
  { year: '2021', title: 'Joined Tamim544', description: 'Contributed to open‑source and built portfolio.' },
  { year: '2022', title: 'Advanced UI', description: 'Implemented futuristic UI with particles and glow.' },
  { year: '2023', title: 'AI Integration', description: 'Added AI chat and analytics features.' },
  { year: '2024', title: 'Current', description: 'Continuously improving the Architect Ledger.' },
];

export const Timeline: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-background text-foreground flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl space-y-8"
      >
        <h1 className="text-3xl font-bold text-gradient text-center mb-6">Career Timeline</h1>
        {milestones.map((m, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/20 border border-primary/40 glow-pulse">
                <span className="text-sm font-medium text-primary">{m.year}</span>
              </div>
            </div>
            <div className="flex-1 bg-background/30 backdrop-blur-sm rounded-lg p-4 border border-primary/20 glow-pulse">
              <h2 className="text-xl font-semibold text-gradient mb-1">{m.title}</h2>
              <p className="text-sm text-white/70">{m.description}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
