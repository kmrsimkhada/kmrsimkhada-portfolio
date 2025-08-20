import React from 'react';

interface HeroProps {
  name: string;
}

const Hero: React.FC<HeroProps> = ({ name }) => {
  const one = <p className="text-accent font-medium mb-4 animate-dramatic-fade-in-up" style={{ animationDelay: '100ms' }}>Hi, my name is</p>;
  const two = <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight animate-dramatic-fade-in-up bg-gradient-to-r from-accent to-accent-light text-transparent bg-clip-text animate-background-pan bg-[size:200%_auto] leading-tight" style={{ animationDelay: '200ms' }}>{name}.</h1>;
  const three = <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-text-secondary tracking-tight mt-2 animate-dramatic-fade-in-up leading-tight" style={{ animationDelay: '300ms' }}>I build things for the web and data.</h2>;
  const four = <p className="mt-6 max-w-xl text-lg text-text-secondary animate-dramatic-fade-in-up" style={{ animationDelay: '400ms' }}>I'm a software and data engineer specializing in building exceptional digital experiences and robust data solutions. Currently, I’m focused on creating scalable, high-performance applications and data pipelines.</p>;
  const five = (
    <div className="mt-12 animate-dramatic-fade-in-up" style={{ animationDelay: '500ms' }}>
      <a 
        href="#contact" 
        className="relative group text-accent border border-accent rounded-md px-8 py-4 text-lg font-medium hover:bg-accent/10 transition-colors duration-300 overflow-hidden"
      >
        <span className="relative z-10">Get In Touch</span>
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 animate-shine transition-opacity duration-500"></span>
      </a>
    </div>
  );

  const items = [one, two, three, four, five];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center -mt-24 sm:-mt-28">
      <div className="w-full px-2 sm:px-0">
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </section>
  );
};

export default Hero;