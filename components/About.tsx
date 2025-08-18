import React from 'react';
import Section from './common/Section';

const About: React.FC = () => {
  return (
    <Section id="about" title="About Me">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-start">
        <div className="md:col-span-3 space-y-4 text-text-secondary">
          <p>
            Hello! I'm Kumar, a passionate Software and Data Engineer with a knack for building robust, scalable applications and intelligent data solutions. My journey in technology has been driven by a relentless curiosity to solve complex problems and create meaningful impact.
          </p>
          <p>
            With a strong foundation in computer science, I specialize in full stack development, as well as designing and implementing large scale data processing systems. I thrive in dynamic environments where I can leverage my skills in Python, React, C#, TypeScript, cloud computing, and Data Engineering to bring ideas to life.
          </p>
           <p>
            My career has taken me across three continents: Asia, Europe, and Australia; giving me a unique global perspective from working in diverse cultures and international markets. This has honed my adaptability and cross-cultural communication skills, allowing me to collaborate effectively with global teams.
          </p>
          <p>
            When I'm not coding, you can find me exploring the latest tech trends, playing football, reading books, or hiking in the mountains. I'm always eager to connect with like minded individuals and explore new opportunities for collaboration.
          </p>
        </div>
        <div className="md:col-span-2 flex justify-center md:justify-start">
          <div className="relative w-full max-w-xs group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-accent-light rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative bg-surface p-1 rounded-lg">
              <img 
                src="/images/kumar-waterfall.jpg?v=2" 
                alt="Kumar Simkhada at a waterfall" 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;