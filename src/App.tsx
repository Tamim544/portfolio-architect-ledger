import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  BackgroundVariant,
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';

import 'reactflow/dist/style.css';
import { useGithub } from './hooks/useGithub';
import { GithubStatus } from './components/GithubStatus';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Star, GitFork, Calendar, HardDrive, Tag, Globe } from 'lucide-react';

// Language color map (matches GitHub's language colors)
const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  'Jupyter Notebook': '#DA5B0B',
  Other: '#8b949e',
};

const getLangColor = (lang: string) => langColors[lang] || langColors.Other;

export default function App() {
  const { stats, repos, loading } = useGithub("Tamim544");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Dynamically generate nodes and edges when repos are loaded
  React.useEffect(() => {
    if (repos.length > 0) {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      const centralNodeId = 'user-center';
      newNodes.push({
        id: centralNodeId,
        type: 'input',
        data: { 
          label: stats?.name || 'Tamim Chowdhury',
          nodeType: 'central',
          bio: stats?.bio,
          publicRepos: stats?.public_repos,
          followers: stats?.followers,
          following: stats?.following,
          location: stats?.location,
          avatarUrl: stats?.avatar_url,
          profileUrl: stats?.html_url,
        },
        position: { x: 500, y: 0 },
        style: {
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '16px',
          padding: '12px 24px',
          color: '#e2e8f0',
          fontWeight: 700,
          fontSize: '14px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 40px rgba(59,130,246,0.08)',
        },
      });

      // Group repos by language
      const reposByLanguage: Record<string, any[]> = {};
      repos.forEach((repo: any) => {
        const lang = repo.language || 'Other';
        if (!reposByLanguage[lang]) reposByLanguage[lang] = [];
        reposByLanguage[lang].push(repo);
      });

      const languages = Object.keys(reposByLanguage);
      const angleStep = (2 * Math.PI) / languages.length;
      const radius = 350;

      languages.forEach((lang, langIdx) => {
        const langNodeId = `lang-${lang}`;
        const x = 500 + radius * Math.cos(langIdx * angleStep);
        const y = 0 + radius * Math.sin(langIdx * angleStep);
        const color = getLangColor(lang);

        newNodes.push({
          id: langNodeId,
          data: { 
            label: lang,
            nodeType: 'language',
            repoCount: reposByLanguage[lang].length,
            repoNames: reposByLanguage[lang].map((r: any) => r.name),
            totalStars: reposByLanguage[lang].reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0),
            color,
          },
          position: { x, y },
          style: {
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${color}40`,
            borderRadius: '12px',
            padding: '8px 20px',
            color: '#e2e8f0',
            fontWeight: 600,
            fontSize: '12px',
            backdropFilter: 'blur(8px)',
            boxShadow: `0 0 20px ${color}08`,
          },
        });

        newEdges.push({
          id: `e-center-${lang}`,
          source: centralNodeId,
          target: langNodeId,
          animated: true,
          style: { stroke: color, strokeWidth: 1.5, opacity: 0.3 },
        });

        // Project Nodes
        const projectRadius = 200;
        const projectRepos = reposByLanguage[lang].slice(0, 5);
        const projectAngleStep = (Math.PI / 2) / (projectRepos.length || 1);

        projectRepos.forEach((repo: any, repoIdx: number) => {
          const repoNodeId = `repo-${repo.name}`;
          const rx = x + projectRadius * Math.cos(langIdx * angleStep + (repoIdx - projectRepos.length / 2) * projectAngleStep);
          const ry = y + projectRadius * Math.sin(langIdx * angleStep + (repoIdx - projectRepos.length / 2) * projectAngleStep);

          newNodes.push({
            id: repoNodeId,
            data: { 
              label: repo.name, 
              nodeType: 'repo',
              description: repo.description,
              url: repo.html_url,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              createdAt: repo.created_at,
              updatedAt: repo.updated_at,
              size: repo.size,
              defaultBranch: repo.default_branch,
              topics: repo.topics,
              hasPages: repo.has_pages,
              openIssues: repo.open_issues_count,
            },
            position: { x: rx, y: ry },
            style: {
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '6px 14px',
              color: '#cbd5e1',
              fontSize: '11px',
              fontWeight: 500,
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
            },
          });

          newEdges.push({
            id: `e-${lang}-${repo.name}`,
            source: langNodeId,
            target: repoNodeId,
            style: { stroke: '#475569', strokeWidth: 1, opacity: 0.2 },
          });
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [repos, stats, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const formatSize = (kb: number) => {
    if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb} KB`;
  };

  return (
    <div className="w-screen h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-[100] bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            <p className="text-xs text-white/40 font-medium">Loading repositories...</p>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.6)"
          style={{ bottom: 80, right: 24 }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={0.8} 
          color="#1e293b" 
        />
      </ReactFlow>

      {/* Header — clean branding */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 z-10 glass px-4 py-3 md:px-5 md:py-4 rounded-xl">
        <div className="flex items-center gap-3">
          {stats?.avatar_url && (
            <img 
              src={stats.avatar_url} 
              alt={stats?.name || 'Profile'}
              className="hidden md:block w-9 h-9 rounded-full ring-2 ring-primary/30"
            />
          )}
          <div>
            <h1 className="text-sm md:text-base font-bold text-white leading-tight">
              {stats?.name || 'Tamim Chowdhury'}
            </h1>
            <p className="text-[10px] md:text-xs text-white/40 leading-tight mt-0.5">
              {stats?.bio || 'Developer'}
            </p>
          </div>
        </div>
      </div>

      <GithubStatus username="Tamim544" />

      {/* Node Detail Sidebar */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-3 md:inset-auto md:top-4 md:right-4 md:bottom-4 w-auto md:w-[380px] z-40 bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-y-auto shadow-2xl"
          >
            <div className="p-5 md:p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0 flex-1 mr-3">
                  <h2 className="text-lg font-bold text-white leading-tight truncate">
                    {selectedNode.data.label}
                  </h2>
                  {selectedNode.data.nodeType === 'language' && (
                    <p className="text-xs text-white/40 mt-1">
                      {selectedNode.data.repoCount} {selectedNode.data.repoCount === 1 ? 'repository' : 'repositories'}
                    </p>
                  )}
                  {selectedNode.data.nodeType === 'repo' && selectedNode.data.language && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: getLangColor(selectedNode.data.language) }}
                      />
                      <span className="text-xs text-white/40">{selectedNode.data.language}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-white/60 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content by node type */}
              <div className="space-y-5">
                
                {/* Central Node */}
                {selectedNode.data.nodeType === 'central' && (
                  <>
                    {selectedNode.data.avatarUrl && (
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedNode.data.avatarUrl} 
                          alt="Profile"
                          className="w-14 h-14 rounded-full ring-2 ring-primary/20"
                        />
                        <div>
                          <p className="text-sm text-white/70">{selectedNode.data.bio || 'Developer'}</p>
                          {selectedNode.data.location && (
                            <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                              <Globe size={11} />
                              {selectedNode.data.location}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Repos', value: selectedNode.data.publicRepos },
                        { label: 'Followers', value: selectedNode.data.followers },
                        { label: 'Following', value: selectedNode.data.following },
                      ].map(item => (
                        <div key={item.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <p className="text-base font-bold text-white">{item.value}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    {selectedNode.data.profileUrl && (
                      <a 
                        href={selectedNode.data.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-all border border-primary/20"
                      >
                        <ExternalLink size={14} />
                        View GitHub Profile
                      </a>
                    )}
                  </>
                )}

                {/* Language Node */}
                {selectedNode.data.nodeType === 'language' && (
                  <>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: selectedNode.data.color || getLangColor(selectedNode.data.label) }}
                        />
                        <span className="text-sm font-medium text-white">{selectedNode.data.label}</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {selectedNode.data.repoCount} {selectedNode.data.repoCount === 1 ? 'project' : 'projects'} built with {selectedNode.data.label}
                        {selectedNode.data.totalStars > 0 && `, earning ${selectedNode.data.totalStars} total stars`}.
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/30 mb-2 font-medium">Projects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.data.repoNames?.map((name: string) => (
                          <span key={name} className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Repo Node */}
                {selectedNode.data.nodeType === 'repo' && (
                  <>
                    {/* Description */}
                    <p className="text-sm text-white/60 leading-relaxed">
                      {selectedNode.data.description || `A ${selectedNode.data.language || ''} project on GitHub.`}
                    </p>

                    {/* Stats */}
                    {(selectedNode.data.stars > 0 || selectedNode.data.forks > 0) && (
                      <div className="flex items-center gap-4">
                        {selectedNode.data.stars > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <Star size={13} className="text-amber-400/70" />
                            <span>{selectedNode.data.stars}</span>
                          </div>
                        )}
                        {selectedNode.data.forks > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <GitFork size={13} className="text-white/30" />
                            <span>{selectedNode.data.forks}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      {selectedNode.data.createdAt && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Calendar size={12} />
                          <span>Created {formatDate(selectedNode.data.createdAt)}</span>
                        </div>
                      )}
                      {selectedNode.data.updatedAt && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Calendar size={12} />
                          <span>Updated {formatDate(selectedNode.data.updatedAt)}</span>
                        </div>
                      )}
                      {selectedNode.data.size > 0 && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <HardDrive size={12} />
                          <span>{formatSize(selectedNode.data.size)}</span>
                        </div>
                      )}
                      {selectedNode.data.hasPages && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Globe size={12} />
                          <span>GitHub Pages active</span>
                        </div>
                      )}
                    </div>

                    {/* Topics */}
                    {selectedNode.data.topics?.length > 0 && (
                      <div>
                        <p className="text-[11px] text-white/30 mb-2 font-medium flex items-center gap-1">
                          <Tag size={10} />
                          Topics
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNode.data.topics.map((topic: string) => (
                            <span key={topic} className="text-[10px] px-2.5 py-1 rounded-lg bg-primary/[0.06] border border-primary/15 text-primary/70">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View on GitHub button */}
                    {selectedNode.data.url && (
                      <a 
                        href={selectedNode.data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-all border border-primary/20"
                      >
                        <ExternalLink size={14} />
                        View on GitHub
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
