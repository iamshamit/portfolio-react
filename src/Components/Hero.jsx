import React, { useContext } from 'react';
import Typical from 'react-typical';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const Hero = () => {
  const { accentColor, accentColors, setIsTerminalOpen } = useContext(ThemeContext);

  return (
    <motion.section
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className={`text-5xl md:text-7xl font-mono ${accentColors[accentColor]} mb-4 animate-glitch`}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typical
          steps={['> Shamit Mishra', 1000]}
          loop={1}
          wrapper="span"
        />
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        // Full-Stack Developer | Code Artist
      </motion.p>
    </motion.section>
  );
};

export default Hero;