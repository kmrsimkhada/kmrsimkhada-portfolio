import React from 'react';

const AuroraBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div 
        className="
          absolute -top-1/4 -left-1/4 w-1/2 h-1/2 
          bg-aurora-cyan rounded-full 
          opacity-30 blur-3xl 
          animate-[spin_20s_linear_infinite_alternate]"
      />
      <div 
        className="
          absolute top-1/4 -right-1/4 w-1/2 h-1/2 
          bg-aurora-teal rounded-full 
          opacity-20 blur-3xl 
          animate-[spin_25s_linear_infinite]"
      />
      <div 
        className="
          absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 
          bg-aurora-cyan rounded-full 
          opacity-20 blur-3xl 
          animate-[spin_30s_linear_infinite_reverse]"
      />
    </div>
  );
};

export default AuroraBackground;