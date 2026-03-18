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
import { ParticleField } from './components/ParticleField';
import { ParticleSettings } from './components/ParticleSettings';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Star, GitFork, Calendar, HardDrive, Tag, Globe, Activity } from 'lucide-react';
import { LanguageCloud } from './components/LanguageCloud';
import { RepoModal } from './components/RepoModal';
import { LiveStats } from './components/LiveStats';
import { SocialHover } from './components/SocialHover';
import { ExportPDF } from './components/ExportPDF';
import { ChatBot } from './components/ChatBot';
import { Routes, Route } from 'react-router-dom';
import { Timeline } from './pages/Timeline';

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
  const [languages, setLanguages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [particleStyle, setParticleStyle] = useState<'dots' | 'lines' | 'nebula'>('dots');
  const [particleCount, setParticleCount] = useState(60);

  // Dynamically generate nodes and edges when repos are loaded
  React.useEffect(() => {
    // Apply search filter
    const filteredRepos = repos.filter((repo: any) => {
      const term = searchTerm.toLowerCase();
      return (
        repo.name.toLowerCase().includes(term) ||
        (repo.description && repo.description.toLowerCase().includes(term))
      );
    });
    if (filteredRepos.length > 0) {
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
          background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.1))',
          border: '1px solid rgba(59,130,246,0.5)',
          borderRadius: '20px',
          padding: '16px 32px',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '15px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 40px rgba(59,130,246,0.25), 0 0 80px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
          letterSpacing: '0.05em',
        },
        className: 'animate-glow-pulse cyber-corners',
      });

      // Group repos by language
      const reposByLanguage: Record<string, any[]> = {};
      filteredRepos.forEach((repo: any) => {
        const lang = repo.language || 'Other';
        if (!reposByLanguage[lang]) reposByLanguage[lang] = [];
        reposByLanguage[lang].push(repo);
      });

      const languages = Object.keys(reposByLanguage);
      setLanguages(languages);
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
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            border: `1px solid ${color}60`,
            borderRadius: '16px',
            padding: '12px 24px',
            color: '#f8fafc',
            fontWeight: 700,
            fontSize: '13px',
            backdropFilter: 'blur(14px)',
            boxShadow: `0 0 30px ${color}20, 0 0 70px ${color}10, inset 0 1px 0 rgba(255,255,255,0.08)`,
            letterSpacing: '0.02em',
          },
          className: 'animate-border-glow',
        });

        newEdges.push({
          id: `e-center-${lang}`,
          source: centralNodeId,
          target: langNodeId,
          animated: true,
          style: { stroke: color, strokeWidth: 1.5, opacity: 0.4 },
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
              langColor: color,
              ownerLogin: repo.owner?.login,
              fullName: repo.full_name,
            },
            position: { x: rx, y: ry },
            style: {
              background: `linear-gradient(135deg, rgba(255,255,255,0.06), ${color}15)`,
              border: `1px solid ${color}30`,
              borderRadius: '14px',
              padding: '10px 18px',
              color: '#f1f5f9',
              fontSize: '12px',
              fontWeight: 600,
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              boxShadow: `0 0 20px ${color}10, inset 0 1px 0 rgba(255,255,255,0.05)`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            className: 'glass-interactive',
          });

          newEdges.push({
            id: `e-${lang}-${repo.name}`,
            source: langNodeId,
            target: repoNodeId,
            style: { stroke: color, strokeWidth: 0.8, opacity: 0.15 },
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
    <div className="w-screen h-screen bg-background text-foreground font-sans overflow-hidden relative hud-grid">
      {/* Particle background */}
      <ParticleField style={particleStyle} count={particleCount} />
        <ExportPDF />

      {/* Top bar with Search and Theme toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
          <ParticleSettings style={particleStyle} setStyle={setParticleStyle} count={particleCount} setCount={setParticleCount} />
        <SearchBar onSearch={setSearchTerm} />
        <ThemeToggle />
      </div>
      <LiveStats />
      <LanguageCloud languages={languages} />
      <Routes>
        <Route path="/timeline" element={<Timeline />} />
      </Routes>

      {/* Cinematic Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[100] loading-overlay flex flex-col items-center justify-center"
          >
            <div className="relative flex flex-col items-center gap-12 max-w-md w-full px-6">
              {/* Spinning geometric HUD element */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-l-2 border-primary/40 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border-b-2 border-r-2 border-accent/30 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/40 rotate-45"
                >
                   <Activity size={24} className="text-primary -rotate-45" />
                </motion.div>
              </div>

              <div className="w-full space-y-4">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-mono font-bold text-primary tracking-[0.2em] uppercase">Initializing Portfolio Node</span>
                   <span className="text-[10px] font-mono text-white/40">v2.0.4-LOCKED</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="h-full loading-bar"
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  <span>Establishing link</span>
                  <span>Fetching assets</span>
                  <span>Finalizing sync</span>
                </div>
              </div>

              {/* Decorative scanlines */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{ bottom: 80, right: 24 }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={0.6} 
          color="#1e3a5f" 
        />
      </ReactFlow>

      {/* Header — futuristic branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-3 left-3 md:top-6 md:left-6 z-10 glass-glow px-4 py-3 md:px-5 md:py-4 rounded-xl animate-glow-pulse"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="flex items-center gap-3">
          {stats?.avatar_url && (
            <div className="relative hidden md:block">
              <img 
                src={stats.avatar_url} 
                alt={stats?.name || 'Profile'}
                className="w-10 h-10 rounded-full ring-2 ring-primary/40"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
            </div>
          )}
          <SocialHover />
          <div>
            <h1 className="text-sm md:text-base font-bold text-gradient leading-tight">
              {stats?.name || 'Tamim Chowdhury'}
            </h1>
            <p className="text-[10px] md:text-xs text-white/35 leading-tight mt-0.5">
              {stats?.bio || 'Developer'}
            </p>
          </div>
        </div>

        {/* Activity indicator */}
        <div className="hidden md:flex items-center gap-1.5 mt-3 pt-2 border-t border-white/[0.04]">
          <Activity size={10} className="text-emerald-400/60" />
          <span className="text-[9px] text-emerald-400/50 font-medium">Live · Synced with GitHub</span>
        </div>
      </motion.div>

      <GithubStatus username="Tamim544" />

      {/* Node Detail Sidebar */}
      <AnimatePresence>
        {selectedNode && selectedNode.data.nodeType !== 'repo' && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-3 md:inset-auto md:top-4 md:right-4 md:bottom-4 w-auto md:w-[400px] z-40 overflow-hidden rounded-2xl shadow-2xl glass-glow border border-primary/20 animate-glow-pulse cyber-corners"
            style={{
              background: 'linear-gradient(180deg, rgba(10,15,35,0.98), rgba(5,10,25,0.99))',
              backdropFilter: 'blur(32px)',
            }}
          >
            {/* Top glow accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute top-0 left-1/4 right-1/4 h-20 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />

            <div className="p-5 md:p-6 overflow-y-auto h-full relative">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0 flex-1 mr-3">
                  <h2 className="text-lg font-bold text-gradient leading-tight truncate">
                    {selectedNode.data.label}
                  </h2>
                  {selectedNode.data.nodeType === 'language' && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse" 
                        style={{ backgroundColor: selectedNode.data.color || getLangColor(selectedNode.data.label) }}
                      />
                      <p className="text-xs text-white/40">
                        {selectedNode.data.repoCount} {selectedNode.data.repoCount === 1 ? 'repository' : 'repositories'}
                      </p>
                    </div>
                  )}
                  {selectedNode.data.nodeType === 'repo' && selectedNode.data.language && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: getLangColor(selectedNode.data.language), boxShadow: `0 0 8px ${getLangColor(selectedNode.data.language)}40` }}
                      />
                      <span className="text-xs text-white/40">{selectedNode.data.language}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-white/25 hover:text-white/60 flex-shrink-0 hover:rotate-90 duration-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="neon-line mb-6" />

              {/* Content by node type */}
              <div className="space-y-5">
                
                {/* Central Node */}
                {selectedNode.data.nodeType === 'central' && (
                  <>
                    {selectedNode.data.avatarUrl && (
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={selectedNode.data.avatarUrl} 
                            alt="Profile"
                            className="w-16 h-16 rounded-full ring-2 ring-primary/30"
                            style={{ boxShadow: '0 0 30px rgba(59,130,246,0.15)' }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-background flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-white/70">{selectedNode.data.bio || 'Developer'}</p>
                          {selectedNode.data.location && (
                            <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                              <Globe size={11} className="text-accent/50" />
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
                        <div key={item.label} className="text-center p-3 rounded-xl glass-interactive" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
                          <p className="text-lg font-bold text-gradient">{item.value}</p>
                          <p className="text-[10px] text-white/25 mt-0.5">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    {selectedNode.data.profileUrl && (
                      <a 
                        href={selectedNode.data.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-medium transition-all group"
                        style={{
                          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.08))',
                          border: '1px solid rgba(59,130,246,0.2)',
                          color: '#60a5fa',
                          boxShadow: '0 0 20px rgba(59,130,246,0.08)',
                        }}
                      >
                        <ExternalLink size={14} className="group-hover:rotate-12 transition-transform" />
                        View GitHub Profile
                      </a>
                    )}
                  </>
                )}

                {/* Language Node */}
                {selectedNode.data.nodeType === 'language' && (
                  <>
                    <div className="p-4 rounded-xl glass-interactive" style={{ borderColor: `${selectedNode.data.color}20` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ 
                            backgroundColor: selectedNode.data.color || getLangColor(selectedNode.data.label),
                            boxShadow: `0 0 12px ${selectedNode.data.color || getLangColor(selectedNode.data.label)}40`
                          }}
                        />
                        <span className="text-sm font-medium text-white">{selectedNode.data.label}</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {selectedNode.data.repoCount} {selectedNode.data.repoCount === 1 ? 'project' : 'projects'} built with {selectedNode.data.label}
                        {selectedNode.data.totalStars > 0 && `, earning ${selectedNode.data.totalStars} total stars`}.
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/25 mb-2 font-medium">Projects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.data.repoNames?.map((name: string) => (
                          <span key={name} className="text-[10px] px-2.5 py-1 rounded-lg text-white/45 glass-interactive" style={{ background: `${selectedNode.data.color}08`, border: `1px solid ${selectedNode.data.color}15` }}>
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
                    <p className="text-sm text-white/55 leading-relaxed">
                      {selectedNode.data.description || `A ${selectedNode.data.language || ''} project on GitHub.`}
                    </p>

                    {(selectedNode.data.stars > 0 || selectedNode.data.forks > 0) && (
                      <div className="flex items-center gap-4">
                        {selectedNode.data.stars > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <Star size={13} className="text-amber-400/70" style={{ filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.3))' }} />
                            <span className="font-mono">{selectedNode.data.stars}</span>
                          </div>
                        )}
                        {selectedNode.data.forks > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <GitFork size={13} className="text-primary/50" />
                            <span className="font-mono">{selectedNode.data.forks}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.06)' }}>
                      {selectedNode.data.createdAt && (
                        <div className="flex items-center gap-2 text-xs text-white/35">
                          <Calendar size={12} className="text-accent/40" />
                          <span>Created {formatDate(selectedNode.data.createdAt)}</span>
                        </div>
                      )}
                      {selectedNode.data.updatedAt && (
                        <div className="flex items-center gap-2 text-xs text-white/35">
                          <Calendar size={12} className="text-accent/40" />
                          <span>Updated {formatDate(selectedNode.data.updatedAt)}</span>
                        </div>
                      )}
                      {selectedNode.data.size > 0 && (
                        <div className="flex items-center gap-2 text-xs text-white/35">
                          <HardDrive size={12} className="text-primary/40" />
                          <span>{formatSize(selectedNode.data.size)}</span>
                        </div>
                      )}
                      {selectedNode.data.hasPages && (
                        <div className="flex items-center gap-2 text-xs text-white/35">
                          <Globe size={12} className="text-emerald-400/40" />
                          <span>GitHub Pages active</span>
                        </div>
                      )}
                    </div>

                    {selectedNode.data.topics?.length > 0 && (
                      <div>
                        <p className="text-[11px] text-white/25 mb-2 font-medium flex items-center gap-1">
                          <Tag size={10} className="text-accent/40" />
                          Topics
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNode.data.topics.map((topic: string) => (
                            <span key={topic} className="text-[10px] px-2.5 py-1 rounded-lg text-primary/60" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedNode.data.url && (
                      <a 
                        href={selectedNode.data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-medium transition-all group"
                        style={{
                          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.08))',
                          border: '1px solid rgba(59,130,246,0.2)',
                          color: '#60a5fa',
                          boxShadow: '0 0 20px rgba(59,130,246,0.08)',
                        }}
                      >
                        <ExternalLink size={14} className="group-hover:rotate-12 transition-transform" />
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
        <ChatBot />

      {/* Repo Modal */}
      {selectedNode && selectedNode.data.nodeType === 'repo' && (
        <RepoModal
          repo={{
            name: selectedNode.data.label,
            description: selectedNode.data.description,
            stargazers_count: selectedNode.data.stars,
            forks_count: selectedNode.data.forks,
            language: selectedNode.data.language,
            updated_at: selectedNode.data.updatedAt,
            owner: { login: selectedNode.data.ownerLogin },
            full_name: selectedNode.data.fullName,
            html_url: selectedNode.data.url,
          }}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}

