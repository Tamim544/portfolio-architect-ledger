import React, { useEffect, useState } from 'react';
import { X, Star, GitFork, Calendar, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface RepoModalProps {
  repo: any; // repository object from GitHub API
  onClose: () => void;
}

export const RepoModal: React.FC<RepoModalProps> = ({ repo, onClose }) => {
  const [readme, setReadme] = useState<string>('');

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`, {
          headers: { Accept: 'application/vnd.github.VERSION.raw' },
        });
        if (res.ok) {
          const text = await res.text();
          setReadme(text);
        }
      } catch (e) {
        console.error('Failed to fetch README', e);
      }
    };
    fetchReadme();
  }, [repo]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <div className="relative w-11/12 max-w-3xl bg-background/90 backdrop-blur-md rounded-xl p-6 border border-primary/20 glow-pulse">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-white/50 hover:text-white transition"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-gradient mb-4">{repo.name}</h2>
          <p className="text-sm text-white/70 mb-4">{repo.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center gap-1 text-xs text-white/60"><Star size={14} /> {repo.stargazers_count}</span>
            <span className="flex items-center gap-1 text-xs text-white/60"><GitFork size={14} /> {repo.forks_count}</span>
            {repo.language && (
              <span className="flex items-center gap-1 text-xs text-white/60"><Globe size={14} /> {repo.language}</span>
            )}
            <span className="flex items-center gap-1 text-xs text-white/60"><Calendar size={14} /> Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
          {readme && (
            <div className="prose prose-sm max-h-96 overflow-y-auto mb-4">
              <ReactMarkdown>{readme}</ReactMarkdown>
            </div>
          )}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View on GitHub
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
