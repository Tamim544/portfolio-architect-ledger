import { useGithub } from '../hooks/useGithub';
import { Github } from 'lucide-react';

export const GithubStatus = ({ username }: { username: string }) => {
  const { stats, loading } = useGithub(username);

  if (loading || !stats) return null;

  return (
    <div className="absolute top-6 right-6 z-10 glass p-4 rounded-xl flex flex-col gap-2 min-w-[200px] border-accent/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Github size={14} className="text-primary" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Remote_Sync</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/60">Repositories</span>
          <span className="text-xs font-bold font-mono">{stats.public_repos}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/60">Followers</span>
          <span className="text-xs font-bold font-mono">{stats.followers}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: '75%' }} 
          />
        </div>
        <p className="text-[9px] text-primary/60 italic text-right uppercase tracking-tighter">
          connection_secure_tls1.3
        </p>
      </div>
    </div>
  );
};
