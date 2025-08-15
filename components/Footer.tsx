import React from 'react';
import SocialLinks from './common/SocialLinks';

interface FooterProps {
  socialLinks: { github: string; linkedin: string; twitter: string };
  name: string;
}

const Footer: React.FC<FooterProps> = ({ socialLinks, name }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 text-center text-text-secondary text-sm">
      <div className="hidden md:flex justify-center items-center space-x-6 mb-6">
        <SocialLinks socialLinks={socialLinks} />
      </div>
      <p className="hover:text-accent transition-colors duration-300">
        Designed & Built by {name} &copy; {currentYear}
      </p>
    </footer>
  );
};

export default Footer;