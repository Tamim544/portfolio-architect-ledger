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
import { Terminal } from './components/Terminal';
import { GithubStatus } from './components/GithubStatus';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Globe, Database, Star, GitBranch } from 'lucide-react';

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

      // Central Node: The User
      const centralNodeId = 'user-center';
      newNodes.push({
        id: centralNodeId,
        type: 'input',
        data: { 
          label: `System Architect: ${stats?.name || 'Tamim Chowdhury'}`,
          nodeType: 'central',
          bio: stats?.bio,
          publicRepos: stats?.public_repos,
          followers: stats?.followers,
          following: stats?.following,
          location: stats?.location,
          company: stats?.company,
          profileUrl: stats?.html_url,
        },
        position: { x: 500, y: 0 },
        className: 'glass rounded-2xl px-8 py-4 text-primary font-black shadow-[0_0_50px_rgba(59,130,246,0.2)] border-primary/50 text-xl uppercase tracking-tighter',
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

        // Language Node
        newNodes.push({
          id: langNodeId,
          data: { 
            label: lang,
            nodeType: 'language',
            repoCount: reposByLanguage[lang].length,
            repoNames: reposByLanguage[lang].map((r: any) => r.name),
            totalStars: reposByLanguage[lang].reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0),
          },
          position: { x, y },
          className: 'glass rounded-xl px-6 py-3 border-accent/50 text-sm font-bold uppercase tracking-wider',
        });

        // Edge from Center to Language
        newEdges.push({
          id: `e-center-${lang}`,
          source: centralNodeId,
          target: langNodeId,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2, opacity: 0.4 },
        });

        // Project Nodes for this language
        const projectRadius = 200;
        const projectRepos = reposByLanguage[lang].slice(0, 5); // Limit to top 5 per lang for clarity
        const projectAngleStep = (Math.PI / 2) / (projectRepos.length || 1);

        projectRepos.forEach((repo, repoIdx) => {
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
              visibility: repo.visibility,
              hasPages: repo.has_pages,
              openIssues: repo.open_issues_count,
            },
            position: { x: rx, y: ry },
            className: 'glass rounded-lg px-4 py-2 text-[11px] border-white/10 hover:border-primary/50 transition-all cursor-pointer shadow-lg',
          });

          // Edge from Language to Repo
          newEdges.push({
            id: `e-${lang}-${repo.name}`,
            source: langNodeId,
            target: repoNodeId,
            style: { stroke: '#94a3b8', strokeWidth: 1, opacity: 0.2 },
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

  const launchProtocol = () => {
    if (selectedNode?.data?.url) {
      window.open(selectedNode.data.url, '_blank');
    }
  };

  return (
    <div className="w-screen h-screen bg-background text-foreground font-sans overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-[100] bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary animate-pulse">Initializing_Sync_Protocol...</p>
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
        <Controls className="!bg-background/80 !border-secondary !shadow-2xl" />
        <MiniMap 
          className="!bg-background/80 !border-secondary !shadow-2xl !bottom-24 !right-6 rounded-2xl overflow-hidden" 
          nodeStrokeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.5)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={1} 
          color="#1e293b" 
        />
      </ReactFlow>

      {/* Header Overlay */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 z-10 glass p-3 md:p-6 rounded-2xl max-w-[200px] md:max-w-sm">
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
          <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg">
            <Cpu className="text-primary" size={16} />
          </div>
          <div>
            <h1 className="text-sm md:text-xl font-black text-white uppercase tracking-wider leading-none">Architect Ledger</h1>
            <p className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest mt-1 italic">Core System v1.0.0</p>
          </div>
        </div>
        <p className="hidden md:block text-xs text-white/60 leading-relaxed mb-4 border-l-2 border-primary/40 pl-3">
          Explore the live technical ecosystem fetched from your GitHub. 
          Draggable, zoomable, and fully inspection-ready.
        </p>
        <div className="hidden md:flex gap-2">
          <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded-md border border-white/10 uppercase text-white/40">TS_2.4.1</span>
          <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded-md border border-white/10 uppercase text-white/40">NODE_V20</span>
        </div>
      </div>

      <GithubStatus username="Tamim544" />

      <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 z-10 glass p-2 md:p-4 rounded-xl flex items-center gap-2 md:gap-4 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        <div className="flex flex-col items-end">
          <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 font-mono">Status</span>
          <span className="text-[10px] md:text-xs font-black uppercase text-green-500 tracking-tighter">System_Online</span>
        </div>
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse" />
      </div>

      <Terminal />

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed inset-3 md:inset-auto md:top-6 md:right-6 md:bottom-6 w-auto md:w-full md:max-w-md z-40 glass rounded-2xl p-5 md:p-8 overflow-y-auto border-primary/20"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/60">Node_Protocol_Active</span>
                </div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedNode.data.label}</h2>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <section className="p-8 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Globe size={120} />
                </div>
                <div className="text-sm leading-relaxed text-white/70 relative z-10">
                  {selectedNode.data.nodeType === 'central' && (
                    <div className="space-y-2">
                      <p>{selectedNode.data.bio || 'System Architect & Full-Stack Developer'}</p>
                      {selectedNode.data.location && <p className="text-white/40 text-xs">📍 {selectedNode.data.location}</p>}
                      <div className="flex gap-4 mt-3 text-xs text-white/50">
                        <span><span className="text-primary font-bold">{selectedNode.data.publicRepos}</span> Repositories</span>
                        <span><span className="text-primary font-bold">{selectedNode.data.followers}</span> Followers</span>
                        <span><span className="text-primary font-bold">{selectedNode.data.following}</span> Following</span>
                      </div>
                    </div>
                  )}
                  {selectedNode.data.nodeType === 'language' && (
                    <div className="space-y-2">
                      <p>Technology cluster containing <span className="text-primary font-bold">{selectedNode.data.repoCount}</span> {selectedNode.data.repoCount === 1 ? 'repository' : 'repositories'} built with <span className="text-white font-semibold">{selectedNode.data.label}</span>.</p>
                      {selectedNode.data.totalStars > 0 && <p className="text-xs text-white/40">⭐ {selectedNode.data.totalStars} total stars across all {selectedNode.data.label} projects</p>}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedNode.data.repoNames?.slice(0, 5).map((name: string) => (
                          <span key={name} className="text-[10px] px-2 py-1 bg-white/5 rounded-md border border-white/10 text-white/50 font-mono">{name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedNode.data.nodeType === 'repo' && (
                    <div className="space-y-2">
                      {selectedNode.data.description ? (
                        <p>{selectedNode.data.description}</p>
                      ) : (
                        <p>A {selectedNode.data.language || ''} project{selectedNode.data.visibility === 'public' ? ', publicly available' : ''} on GitHub.</p>
                      )}
                      <div className="mt-3 space-y-1 text-xs text-white/40">
                        {selectedNode.data.createdAt && <p>🚀 Created: {new Date(selectedNode.data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>}
                        {selectedNode.data.updatedAt && <p>🔄 Last Updated: {new Date(selectedNode.data.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>}
                        {selectedNode.data.size > 0 && <p>📦 Size: {selectedNode.data.size > 1024 ? `${(selectedNode.data.size / 1024).toFixed(1)} MB` : `${selectedNode.data.size} KB`}</p>}
                        {selectedNode.data.defaultBranch && <p>🌿 Branch: {selectedNode.data.defaultBranch}</p>}
                        {selectedNode.data.openIssues > 0 && <p>📋 Open Issues: {selectedNode.data.openIssues}</p>}
                        {selectedNode.data.hasPages && <p>🌐 GitHub Pages: Active</p>}
                      </div>
                      {selectedNode.data.topics?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedNode.data.topics.map((topic: string) => (
                            <span key={topic} className="text-[10px] px-2 py-1 bg-primary/10 rounded-md border border-primary/20 text-primary/80 font-mono">{topic}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {!selectedNode.data.nodeType && (
                    <p>Node inspection data loaded.</p>
                  )}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 glass rounded-2xl text-left border-white/5 group hover:border-primary/40 transition-all">
                  <Database size={16} className="text-primary mb-3 opacity-40" />
                  <span className="block text-[10px] uppercase text-white/30 mb-2 tracking-widest font-mono">Data_Source</span>
                  <span className="text-xs font-bold text-white italic uppercase tracking-tighter">GITHUB_FETCH_V3</span>
                </div>
                <div className="p-6 glass rounded-2xl text-left border-white/5 group hover:border-primary/40 transition-all">
                  <Globe size={16} className="text-primary mb-3 opacity-40" />
                  <span className="block text-[10px] uppercase text-white/30 mb-2 tracking-widest font-mono">Sync_Status</span>
                  <span className="text-xs font-bold text-green-400 italic uppercase tracking-tighter">OPTIMIZED</span>
                </div>
              </div>

              {selectedNode.data.stars !== undefined && (
                <div className="flex items-center gap-6 px-4">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-yellow-500" />
                    <span className="text-xs font-mono font-bold text-white/80">{selectedNode.data.stars}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch size={14} className="text-primary" />
                    <span className="text-xs font-mono font-bold text-white/80">{selectedNode.data.forks}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] px-2">
                  <span>Integrity_Check</span>
                  <span>100%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-accent" 
                  />
                </div>
              </div>

              <button 
                onClick={launchProtocol}
                disabled={!selectedNode.data.url}
                className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-primary/80 transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Launch_Integration_Protocol
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
