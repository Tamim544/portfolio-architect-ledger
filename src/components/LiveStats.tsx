import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface Stats {
  totalStars: number;
  totalForks: number;
  recentCommit: string;
}

export const LiveStats: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ totalStars: 0, totalForks: 0, recentCommit: '' });

  const fetchStats = async () => {
    try {
      const reposRes = await fetch('https://api.github.com/users/Tamim544/repos?per_page=100');
      const repos = await reposRes.json();
      const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
      const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);
      // Get most recent commit date from the latest repo
      const recentRepo = repos[0];
      const recentCommit = recentRepo?.pushed_at ? new Date(recentRepo.pushed_at).toLocaleDateString() : '';
      setStats({ totalStars, totalForks, recentCommit });
    } catch (e) {
      console.error('Failed to fetch live stats', e);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000); // refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-background/30 backdrop-blur-sm rounded-lg p-3 border border-primary/20 glow-pulse">
      <div className="flex items-center gap-1 text-sm text-white/70">
        <Activity size={14} className="text-accent/50" /> Stars: {stats.totalStars}
      </div>
      <div className="flex items-center gap-1 text-sm text-white/70">
        <Activity size={14} className="text-accent/50" /> Forks: {stats.totalForks}
      </div>
      {stats.recentCommit && (
        <div className="flex items-center gap-1 text-sm text-white/70">
          <Activity size={14} className="text-accent/50" /> Latest activity: {stats.recentCommit}
        </div>
      )}
    </div>
  );
};
