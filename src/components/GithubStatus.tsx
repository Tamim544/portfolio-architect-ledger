import { useGithub } from '../hooks/useGithub';
import { Github, MapPin, Activity, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const GithubStatus = ({ username }: { username: string }) => {
  const { stats, loading } = useGithub(username);

  if (loading || !stats) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute top-3 right-3 md:top-6 md:right-6 z-10 glass-glow px-4 py-4 rounded-xl max-w-[200px] border border-primary/20 cyber-corners animate-glow-pulse"
    >
      {/* HUD Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-primary/10 pb-2">
        <Terminal size={14} className="text-primary/70" />
        <span className="text-[10px] font-mono text-primary/60 tracking-widest uppercase">System Status</span>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        {stats.avatar_url && (
          <div className="relative">
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm animate-pulse" />
            <img 
              src={stats.avatar_url} 
              alt={stats.name || username}
              className="w-10 h-10 rounded-full ring-2 ring-primary/40 relative z-10"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background z-20" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate neon-text-blue">{stats.name || username}</p>
          <p className="text-[10px] text-primary/50 truncate font-mono">ID: {stats.login || username}</p>
        </div>
      </div>

      <div className="space-y-2 py-2">
        <div className="flex justify-between items-center group">
          <span className="text-[10px] text-white/40 group-hover:text-primary/60 transition-colors">PUBLIC_REPOS</span>
          <span className="text-xs font-mono font-bold text-primary tabular-nums">{stats.public_repos}</span>
        </div>
        <div className="flex justify-between items-center group">
          <span className="text-[10px] text-white/40 group-hover:text-primary/60 transition-colors">FOLLOWER_COUNT</span>
          <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">{stats.followers}</span>
        </div>
        {stats.location && (
          <div className="flex items-center gap-2 pt-2 border-t border-primary/5">
            <MapPin size={10} className="text-accent/60" />
            <span className="text-[10px] text-white/30 truncate font-mono">{stats.location.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Connection indicator */}
      <div className="mt-4 flex items-center gap-2 px-2 py-1 bg-primary/5 rounded border border-primary/10">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-bold text-emerald-500/80 font-mono tracking-tighter">DATA_SYNC_ACTIVE</span>
      </div>

      <a 
        href={stats.html_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded bg-primary/10 hover:bg-primary/20 text-[10px] font-bold text-primary/80 hover:text-primary transition-all border border-primary/20 tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98]"
      >
        <Github size={12} />
        <span>Acknowledge</span>
      </a>
    </motion.div>
  );
};
