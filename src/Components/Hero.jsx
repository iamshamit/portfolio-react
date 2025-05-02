import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';
import { TypeAnimation } from 'react-type-animation';
import Starfield from './Starfield';

const Hero = () => {
  const { accentColor, accentColors } = useContext(ThemeContext);
  const [showCursor, setShowCursor] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);


  useEffect(() => {
    // Hide cursor after typing animation finishes
    const timer = setTimeout(() => {
      setShowCursor(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInteractionSound = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Starfield background specifically for Hero */}
      <div className="absolute inset-0 z-0">
        <Starfield />
      </div>
      
      {/* Glitch overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D0D0D]/80 z-1"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-1"></div>
      
      <motion.div 
        className="max-w-4xl mx-auto text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="glitch-wrapper mb-6"
          variants={itemVariants}
        >
          <h1 className={`text-6xl md:text-8xl font-bold mb-4 ${accentColors[accentColor]} glitch-text`}>
            Shamit Mishra
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-8 text-xl md:text-2xl text-gray-300 font-mono"
        >
          <span className="inline-block">
            <TypeAnimation
              sequence={['',1500,'Full-Stack Developer', 2000, 'UI/UX Enthusiast', 2000, 'College Student', 2000]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
            <span className={`${showCursor ? 'animate-blink' : 'opacity-0'} ${accentColors[accentColor]}`}></span>
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
          <motion.a
            href="#about"
            className={`px-6 py-3 border ${accentColors[accentColor]} rounded-md backdrop-blur-sm bg-black/30 hover:shadow-glow transition-all`}
            whileHover={{ scale: 1.05, boxShadow: `0 0 15px 2px ${accentColor === 'neon-blue' ? '#00FFFF' : accentColor === 'neon-green' ? '#00FF88' : '#B388FF'}` }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => handleInteractionSound('hover')}
            onClick={() => handleInteractionSound('click')}
          >
            Explore
          </motion.a>
          
          <motion.a
            href="#contact"
            className="px-6 py-3 border border-gray-700 rounded-md backdrop-blur-sm bg-black/30 hover:border-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => handleInteractionSound('hover')}
            onClick={() => handleInteractionSound('click')}
          >
            Contact Me
          </motion.a>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <motion.div 
            className={`${accentColors[accentColor]} animate-bounce`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;