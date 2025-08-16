import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './common/Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Work' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
    { href: '/blog', label: 'Blog', isRoute: true },
    { href: '/reading', label: 'Reading', isRoute: true },
    { href: '/travel', label: 'Travel', isRoute: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['hero', ...navLinks.filter(l => !l.isRoute).map(l => l.href.substring(1))];
      let currentSection = 'hero';

      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navLinks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isMenuOpen) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
      }
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Better mobile scroll handling
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 fixed-header ${isScrolled ? 'h-16 sm:h-20 bg-background/80 backdrop-blur-md shadow-lg shadow-surface/20' : 'h-20 sm:h-24'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full flex justify-between items-center">
        <a href="/" aria-label="home" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm" onClick={closeMenu}>
          <Logo />
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium transition-colors duration-300 hover:text-accent text-text-secondary"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-accent ${activeSection === link.href.substring(1) ? 'text-accent' : 'text-text-secondary'}`}
              >
                {link.label}
              </a>
            )
          )}
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="z-50 relative w-8 h-8 text-accent focus:outline-none menu-toggle" aria-label="Open menu">
            <span className={`block w-7 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2' : '-translate-y-2'}`}></span>
            <span className={`block w-7 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-7 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : 'translate-y-2'}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-xs bg-surface transform transition-transform duration-300 ease-in-out z-40 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden mobile-menu`}>
        <div className="h-full flex flex-col justify-center items-center py-20 px-6 overflow-y-auto mobile-menu-container">
          <nav className="flex flex-col items-center space-y-6 w-full">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  className="text-lg text-text-primary hover:text-accent transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-background/20 w-full text-center nav-link"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-lg text-text-primary hover:text-accent transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-background/20 w-full text-center nav-link"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>
        </div>
      </aside>
      {isMenuOpen && <div onClick={closeMenu} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>}
    </header>
  );
};

export default Header;