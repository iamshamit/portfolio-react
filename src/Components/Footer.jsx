import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const Footer = () => {
  const { accentColor, accentColors, setIsTerminalOpen } = useContext(ThemeContext);

  return (
    <motion.footer
      className="py-8 px-4 text-center text-gray-400"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p>&copy; 2025 Shamit Mishra. All rights reserved.</p>
      <motion.div
        className={`mt-4 cursor-pointer font-mono ${accentColors[accentColor]} hover:shadow-glow transition-shadow`}
        onClick={() => setIsTerminalOpen(true)}
        whileHover={{ scale: 1.05 }}
      >
        &gt;_ Secret Terminal
      </motion.div>
    </motion.footer>
  );
};

export default Footer;