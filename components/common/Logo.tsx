import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="group" style={{ perspective: '1000px' }}>
      <div className="w-12 h-12 flex items-center justify-center transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]">
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-accent"
        >
          <rect x="1.5" y="1.5" width="41" height="41" rx="8.5" stroke="currentColor" strokeWidth="3"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="bold" fill="currentColor" fontFamily="Inter, sans-serif">
            KS
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Logo;