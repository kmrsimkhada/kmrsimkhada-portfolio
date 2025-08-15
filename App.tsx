import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticleBackground from './components/common/ParticleBackground';
import Blog from './pages/Blog';
import Reading from './pages/Reading';
import Travel from './pages/Travel';
import Article from './pages/Article';
import Admin from './pages/Admin';

const App: React.FC = () => {
  const socialLinks = {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  };

  const name = 'Kumar Simkhada';
  const email = 'kumar.simkhada@email.com';

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-background relative">
              <ParticleBackground />
              <div className="relative z-10">
                <Header />
                <main className="px-6 sm:px-8 md:px-16 lg:px-24 max-w-6xl mx-auto">
                  <Hero name={name} />
                  <About />
                  <Experience />
                  <Projects />
                  <Skills />
                  <Contact email={email} />
                </main>
                <Footer socialLinks={socialLinks} name={name} />
              </div>
            </div>
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Article />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;