import React, { useEffect, useState } from 'react';

interface LanguageCloudProps {
  languages: string[];
}

export const LanguageCloud: React.FC<LanguageCloudProps> = ({ languages }) => {
  const [items, setItems] = useState<{ name: string; angle: number }[]>([]);

  useEffect(() => {
    const count = languages.length;
    const generated = languages.map((lang, idx) => ({
      name: lang,
      angle: (360 / count) * idx,
    }));
    setItems(generated);
  }, [languages]);

  return (
    <div className="absolute top-4 left-4 w-48 h-48 pointer-events-none">
      <div className="cloud-container w-full h-full relative">
        {items.map((item) => (
          <span
            key={item.name}
            className="cloud-item absolute text-sm text-white/70"
            style={{
              transform: `rotate(${item.angle}deg) translateX(80px) rotate(-${item.angle}deg)`,
            }}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
};
