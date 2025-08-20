import React from 'react';

interface ContactProps {
  email: string;
}

const Contact: React.FC<ContactProps> = ({ email }) => {
  return (
    <section id="contact" className="py-16 sm:py-24 text-center flex flex-col items-center px-4 sm:px-0">
      <h2 className="text-accent font-medium mb-2">What’s Next?</h2>
      <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">Get In Touch</h3>
      <p className="text-text-secondary max-w-xl mx-auto mb-8">
        I'm currently open to new opportunities and my inbox is always open. Whether you have a question or just want to say hi, I’ll do my best to get back to you!
      </p>
      <a 
        href={`mailto:${email}`} 
        className="relative group text-accent border border-accent rounded-md px-8 py-4 text-lg font-medium hover:bg-accent/10 transition-colors duration-300 overflow-hidden"
      >
        <span className="relative z-10">Say Hello</span>
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 animate-shine transition-opacity duration-500"></span>
      </a>
    </section>
  );
};

export default Contact;