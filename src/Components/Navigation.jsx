import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const Navigation = () => {
  const { accentColor, accentColors, setIsTerminalOpen } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  
  // Handle scroll events for navbar styling and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      
      // Determine which section is currently in view
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle terminal button click
  const openTerminal = () => {
    setIsTerminalOpen(true);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md bg-black/50' : 'bg-transparent'
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          className={`text-xl font-mono ${accentColors[accentColor]}`}
          variants={itemVariants}
        >
          <span className="animate-glitch" data-text="S.MISHRA">S.MISHRA</span>
        </motion.div>
        
        <motion.div className="hidden md:flex space-x-6" variants={itemVariants}>
          {['hero', 'about', 'skills', 'projects', 'contact'].map((section) => (
            <motion.a
              key={section}
              className={`nav-link uppercase text-sm ${
                activeSection === section ? accentColors[accentColor] : 'text-gray-300'
              }`}
              onClick={() => scrollToSection(section)}
              whileHover={{ scale: 1.05 }}
              variants={itemVariants}
            >
              {section === 'hero' ? 'Home' : section}
            </motion.a>
          ))}
          
          <motion.button
            className={`px-4 py-1 border ${accentColors[accentColor]} rounded hover:shadow-glow transition-shadow uppercase text-sm`}
            onClick={openTerminal}
            whileHover={{ scale: 1.05 }}
            variants={itemVariants}
          >
            Terminal
          </motion.button>
        </motion.div>
        
        {/* Mobile menu button */}
        <motion.div className="md:hidden" variants={itemVariants}>
          <button 
            className={`px-2 py-1 border ${accentColors[accentColor]} hover:shadow-glow transition-shadow`}
            onClick={() => console.log('Mobile menu toggled')}
          >
            Menu
          </button>
        </motion.div>
      </div>
      
      {/* HUD corner elements */}
      <div 
        className={`hud-corner hud-corner-tl ${accentColors[accentColor]}`}
      ></div>
      <div 
        className={`hud-corner hud-corner-tr ${accentColors[accentColor]}`}
      ></div>
    </motion.nav>
  );
};

export default Navigation;