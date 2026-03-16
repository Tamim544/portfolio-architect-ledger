import { useState, useEffect } from 'react';

export const useGithub = (username: string) => {
  const [stats, setStats] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch User Stats
        const statsResponse = await fetch(`https://api.github.com/users/${username}`);
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch Repositories
        // We use sort=updated to get most recent ones first
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
        const reposData = await reposResponse.json();
        
        // Filter out forked repos if needed, but for portfolio we usually want originals
        const originalRepos = reposData.filter((repo: any) => !repo.fork);
        setRepos(originalRepos);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchData();
  }, [username]);

  return { stats, repos, loading };
};
