import type { Node, Edge } from 'reactflow';

export const initialNodes: Node[] = [
  {
    id: 'hero',
    type: 'input',
    data: { label: 'Start Exploration: Tamim Chowdhury' },
    position: { x: 250, y: 0 },
    className: 'glass rounded-lg px-4 py-2 text-primary font-bold shadow-xl border-primary/50',
  },
  {
    id: 'projects',
    data: { label: 'My Projects' },
    position: { x: 100, y: 150 },
    className: 'glass rounded-lg px-4 py-2 border-accent/50',
  },
  {
    id: 'skills',
    data: { label: 'Core Skills' },
    position: { x: 400, y: 150 },
    className: 'glass rounded-lg px-4 py-2 border-accent/50',
  },
  // Example Project Node
  {
    id: 'p1',
    data: { label: 'Architect Ledger (This Website)' },
    position: { x: 0, y: 300 },
    className: 'glass rounded-lg px-4 py-2 text-sm',
  },
  // Example Skill Node
  {
    id: 's1',
    data: { label: 'React + TypeScript' },
    position: { x: 400, y: 300 },
    className: 'glass rounded-lg px-4 py-2 text-sm',
  },
];

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'hero', target: 'projects', animated: true },
  { id: 'e1-3', source: 'hero', target: 'skills', animated: true },
  { id: 'e2-p1', source: 'projects', target: 'p1' },
  { id: 'e3-s1', source: 'skills', target: 's1' },
];
