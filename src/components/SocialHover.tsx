import React from 'react';
import { ExternalLink } from 'lucide-react';

export const SocialHover: React.FC = () => {
  // Placeholder social links; replace with actual URLs as needed
  const links = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/tamimchowdhury' },
    { name: 'Twitter', url: 'https://twitter.com/tamimchowdhury' },
    { name: 'GitHub', url: 'https://github.com/Tamim544' },
  ];

  return (
    <div className="absolute top-16 right-4 z-20 bg-background/30 backdrop-blur-sm rounded-lg p-3 border border-primary/20 glow-pulse">
      {links.map(link => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-white/80 hover:text-primary transition-colors mb-2"
        >
          <ExternalLink size={14} className="text-white/60" />
          {link.name}
        </a>
      ))}
    </div>
  );
};
