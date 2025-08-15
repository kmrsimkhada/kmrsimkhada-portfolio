import React, { useState } from 'react';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative rounded-xl p-px bg-gradient-to-br from-accent/20 via-white/10 to-transparent hover:from-accent/40 hover:via-accent/20 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full bg-surface/90 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-between overflow-hidden border border-white/5 hover:border-accent/20 transition-all duration-500">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-accent/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-200 animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <header className="flex justify-between items-start mb-6">
            <div className={`text-accent transition-all duration-500 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative text-text-secondary hover:text-accent transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 group/link" 
                  aria-label="GitHub repository"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-sm opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative text-text-secondary hover:text-accent transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 group/link" 
                  aria-label="Live demo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-sm opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                </a>
              )}
            </div>
          </header>
          
          <main className="flex-grow mb-6">
            <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-all duration-300 mb-3 leading-tight">
              {project.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed group-hover:text-text-primary transition-colors duration-300">
              {project.description}
            </p>
          </main>
          
          <footer>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span 
                  key={tag}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/40 transition-all duration-300 transform hover:scale-105 ${
                    isHovered ? 'animate-pulse' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 animate-pulse"></span>
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;