import React, { useState, useEffect } from 'react';
import Section from './common/Section';
import ProjectCard from './common/ProjectCard';
import { apiService } from '../services/api';
import type { Project } from '../types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await apiService.getProjects();
        setProjects(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (error) {
        console.error('Failed to load projects:', error);
        // Fallback to empty array
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    // Stagger the animation of project cards
    projects.forEach((_, index) => {
      setTimeout(() => {
        setVisibleProjects(prev => [...prev, index]);
      }, index * 150);
    });
  }, [projects]);

  return (
    <Section id="projects" title="My Projects">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        {/* Project grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">No projects available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ${
                visibleProjects.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}

        {/* Show more projects hint if there are many */}
        {projects.length > 6 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all duration-300 cursor-pointer group">
              <span className="text-sm font-medium mr-2">View More Projects</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Projects;