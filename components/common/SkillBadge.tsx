import React from 'react';

interface SkillBadgeProps {
  name: string;
  isVisible: boolean;
  delay: number;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name, isVisible, delay }) => {
  return (
    <div 
      className={`
        bg-light-navy/50 backdrop-blur-sm border border-blue/20 
        text-light-slate font-medium
        px-4 py-2 rounded-md
        transition-all duration-500 ease-out
        transform hover:-translate-y-1 
        hover:shadow-lg hover:shadow-blue/10
        cursor-default
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {name}
    </div>
  );
};

export default SkillBadge;