import React, { useState, useEffect } from 'react';
import Section from './common/Section';
import { apiService } from '../services/api';
import type { Skill } from '../types';

const Skills: React.FC = () => {
  console.log('🎨 Skills component: Component is rendering!');
  
  const [skills, setSkills] = useState<{ [key: string]: Skill[] }>({});
  const [loading, setLoading] = useState(true);
  const [visibleSkills, setVisibleSkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadSkills = async () => {
      try {
        console.log('🔍 Skills component: Starting to load skills...');
        const data = await apiService.getSkills();
        console.log('✅ Skills component: API response:', data);
        
        // Group skills by category
        const groupedSkills = data.reduce((acc: { [key: string]: Skill[] }, skill: Skill) => {
          const category = skill.category || 'Other';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(skill);
          return acc;
        }, {});
        
        console.log('📊 Skills component: Grouped skills:', groupedSkills);
        
        // Sort skills within each category by order
        Object.keys(groupedSkills).forEach(category => {
          groupedSkills[category].sort((a, b) => (a.order || 0) - (b.order || 0));
        });
        
        console.log('🎯 Skills component: Setting skills state:', groupedSkills);
        setSkills(groupedSkills);
      } catch (error) {
        console.error('❌ Skills component: Failed to load skills:', error);
        setSkills({});
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillName = entry.target.getAttribute('data-skill');
            if (skillName) {
              setTimeout(() => {
                setVisibleSkills(prev => new Set([...prev, skillName]));
              }, parseInt(entry.target.getAttribute('data-delay') || '0'));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const skillElements = document.querySelectorAll('[data-skill]');
    skillElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Temporarily make all skills visible immediately
  useEffect(() => {
    if (Object.keys(skills).length > 0) {
      console.log('🎯 Skills component: Making all skills visible immediately');
      const allSkillNames = Object.values(skills).flat().map(skill => skill.name);
      setVisibleSkills(new Set(allSkillNames));
    }
  }, [skills]);

  const getSkillIcon = (skillName: string) => {
    const icons: { [key: string]: string } = {
      'TypeScript': '🔷',
      'React': '⚛️',
      'Node.js': '🟢',
      'Python': '🐍',
      'Django': '🎸',
      'FastAPI': '⚡',
      'Next.js': '▲',
      'TailwindCSS': '🎨',
      'PostgreSQL': '🐘',
      'MongoDB': '🍃',
      'Redis': '🔴',
      'SQL': '📊',
      'Pandas': '🐼',
      'Spark': '✨',
      'Airflow': '🌊',
      'AWS': '☁️',
      'Docker': '🐳',
      'Kubernetes': '⚙️',
      'Terraform': '🏗️',
      'CI/CD': '🔄',
      'GitHub Actions': '🚀',
      'Vercel': '▲'
    };
    return icons[skillName] || '💻';
  };

  return (
    <Section id="skills" title="My Tech Stack">
      <p className="max-w-2xl text-text-secondary mb-12">
        I enjoy working with a diverse range of technologies across the stack. Here are some of the tools and technologies I've been using recently.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(skills).map(([category, skillList], categoryIndex) => (
          <div key={category} className="group">
            <div className="bg-surface/30 rounded-xl p-6 hover:bg-surface/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-accent/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">
                    {category.includes('Languages') ? '💻' : 
                     category.includes('Databases') ? '🗄️' : 
                     category.includes('Cloud') ? '☁️' : '🛠️'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors duration-300">
                  {category}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {skillList.map((skill, index) => (
                  <div
                    key={skill.name}
                    data-skill={skill.name}
                    data-delay={categoryIndex * 200 + index * 100}
                    className={`
                      bg-surface-light/50 backdrop-blur-sm border border-accent/20 
                      text-text-primary font-medium text-sm
                      px-3 py-2 rounded-lg
                      transition-all duration-500 ease-out
                      transform hover:-translate-y-1 hover:scale-105
                      hover:shadow-lg hover:shadow-accent/20
                      hover:border-accent/40 hover:bg-accent/10
                      cursor-default flex items-center space-x-2
                      ${visibleSkills.has(skill.name) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    `}
                  >
                    <span className="text-lg">{getSkillIcon(skill.name)}</span>
                    <span className="truncate">{skill.name}</span>
                  </div>
                ))}
              </div>
              
              {/* Category decoration */}
              <div className="mt-4 h-1 bg-gradient-to-r from-accent/50 to-accent-light/50 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional visual elements */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-surface/30 rounded-full px-6 py-3 hover:bg-surface/50 transition-colors duration-300">
          <span className="text-accent">✨</span>
          <span className="text-text-secondary">Always learning and exploring new technologies</span>
          <span className="text-accent">✨</span>
        </div>
      </div>
    </Section>
  );
};

export default Skills;