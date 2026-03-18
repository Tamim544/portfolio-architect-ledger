import { useGithub } from '../hooks/useGithub';
import { Github, MapPin } from 'lucide-react';

export const GithubStatus = ({ username }: { username: string }) => {
  const { stats, loading } = useGithub(username);

  if (loading || !stats) return null;

  return (
    <div className="absolute top-3 right-3 md:top-6 md:right-6 z-10 glass p-3 md:p-4 rounded-xl max-w-[180px] md:max-w-[200px]">
      <div className="flex items-center gap-2 mb-3">
        {stats.avatar_url && (
          <img 
            src={stats.avatar_url} 
            alt={stats.name || username}
            className="w-7 h-7 rounded-full ring-1 ring-white/10"
          />
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-white truncate">{stats.name || username}</p>
          <p className="text-[9px] text-white/40 truncate">@{stats.login || username}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/40">Repos</span>
          <span className="text-[11px] font-semibold text-white/80 tabular-nums">{stats.public_repos}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/40">Followers</span>
          <span className="text-[11px] font-semibold text-white/80 tabular-nums">{stats.followers}</span>
        </div>
        {stats.location && (
          <div className="flex items-center gap-1 pt-1">
            <MapPin size={10} className="text-white/30" />
            <span className="text-[9px] text-white/30 truncate">{stats.location}</span>
          </div>
        )}
      </div>

      <a 
        href={stats.html_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[10px] text-white/50 hover:text-white/70 transition-all"
      >
        <Github size={11} />
        <span>View Profile</span>
      </a>
    </div>
  );
};
