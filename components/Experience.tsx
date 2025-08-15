import React, { useState, useEffect } from 'react';
import Section from './common/Section';
import { apiService } from '../services/api';
import type { Experience as ExperienceType } from '../types';

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await apiService.getExperiences();
        setExperiences(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (error) {
        console.error('Failed to load experiences:', error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  if (loading) {
    return (
      <Section id="experience" title="Where I've Worked">
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading experience...</p>
        </div>
      </Section>
    );
  }

  if (experiences.length === 0) {
    return (
      <Section id="experience" title="Where I've Worked">
        <div className="text-center py-12">
          <p className="text-text-secondary">No experience data available yet.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="experience" title="Where I've Worked">
      <div className="flex flex-col md:flex-row gap-8 min-h-[300px]">
        {/* Tab List */}
        <div className="flex flex-row overflow-x-auto md:overflow-x-visible md:flex-col md:flex-nowrap -mx-4 px-4">
          {experiences.map((exp, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`text-left px-4 py-3 text-sm transition-colors duration-300 border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap ${activeTab === index ? 'text-accent border-accent bg-surface' : 'text-text-secondary border-transparent md:border-surface-light hover:bg-surface hover:text-accent'}`}
            >
              {exp.company}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="flex-grow mt-4 md:mt-0">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`${activeTab === index ? 'block' : 'hidden'} transition-opacity duration-500`}
            >
              <h3 className="text-xl font-medium text-text-primary">
                {exp.role} <span className="text-accent">@ {exp.company}</span>
              </h3>
              <p className="text-sm text-text-secondary mt-1 mb-4">{exp.duration}</p>
              <ul className="space-y-2 text-text-secondary">
                {exp.description.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-accent mr-3 mt-1 text-sm">▹</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Experience;