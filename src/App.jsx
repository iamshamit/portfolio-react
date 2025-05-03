import React, { createContext, useState, useEffect } from 'react';
import Hero from './Components/Hero';
import About from './Components/About';
import Skills from './Components/Skills';
import Projects from './Components/Projects';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import Terminal from './Components/Terminal';
import ScrollToTop from './Components/ScrollToTop';
import ScrollToTopButton from './Components/ScrollToTopButton';

export const ThemeContext = createContext();

const App = () => {
  const [accentColor, setAccentColor] = useState('neon-green');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const accentColors = {
    'neon-blue': 'text-cyan-400 border-cyan-400 shadow-cyan-400',
    'neon-green': 'text-green-400 border-green-400 shadow-green-400',
    'neon-purple': 'text-purple-400 border-purple-400 shadow-purple-400',
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        const colors = Object.keys(accentColors);
        const currentIndex = colors.indexOf(accentColor);
        const nextIndex = (currentIndex + 1) % colors.length;
        setAccentColor(colors[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor, accentColors, isTerminalOpen, setIsTerminalOpen }}>
      <div className="relative min-h-screen bg-[#0D0D0D] text-white font-sans overflow-x-hidden">
        <div className="scanlines"></div>
        <ScrollToTop />
        <ScrollToTopButton />
        {isTerminalOpen ? (
          <Terminal />
        ) : (
          <>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
          </>
        )}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;