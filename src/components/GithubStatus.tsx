import { useGithub } from '../hooks/useGithub';
import { Github, MapPin } from 'lucide-react';

export const GithubStatus = ({ username }: { username: string }) => {
  const { stats, loading } = useGithub(username);

  if (loading || !stats) return null;

  return (
    <div className="absolute top-3 right-3 md:top-6 md:right-6 z-10 glass-glow px-3 py-3 md:px-4 md:py-3.5 rounded-xl max-w-[180px] md:max-w-[200px] animate-border-glow">
      {/* Scan line decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="flex items-center gap-2 mb-3">
        {stats.avatar_url && (
          <div className="relative">
            <img 
              src={stats.avatar_url} 
              alt={stats.name || username}
              className="w-7 h-7 rounded-full ring-1 ring-primary/30"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-white truncate">{stats.name || username}</p>
          <p className="text-[9px] text-primary/50 truncate font-mono">@{stats.login || username}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/30">Repos</span>
          <span className="text-[11px] font-semibold text-primary/80 tabular-nums font-mono">{stats.public_repos}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/30">Followers</span>
          <span className="text-[11px] font-semibold text-primary/80 tabular-nums font-mono">{stats.followers}</span>
        </div>
        {stats.location && (
          <div className="flex items-center gap-1 pt-1">
            <MapPin size={10} className="text-accent/50" />
            <span className="text-[9px] text-white/25 truncate">{stats.location}</span>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="neon-line mt-3 mb-2" />

      <a 
        href={stats.html_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-primary/[0.08] hover:bg-primary/15 text-[10px] text-primary/60 hover:text-primary/90 transition-all border border-primary/10 hover:border-primary/25"
      >
        <Github size={11} />
        <span>View Profile</span>
      </a>
    </div>
  );
};
