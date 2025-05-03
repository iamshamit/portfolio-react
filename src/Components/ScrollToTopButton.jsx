import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../App';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { accentColor, accentColors } = useContext(ThemeContext);
  
  // Show button when user scrolls down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={`fixed bottom-8 right-8 w-12 h-12 rounded-full backdrop-blur-sm 
                    bg-black/30 ${accentColors[accentColor]} z-50 flex items-center justify-center
                    hover:bg-black/50 transition-all border-2 shadow-glow`}
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: `0 0 15px 5px ${accentColor === 'neon-blue' ? 'rgba(0, 243, 255, 0.5)' : 
                        accentColor === 'neon-green' ? 'rgba(0, 255, 136, 0.5)' : 
                        'rgba(179, 136, 255, 0.5)'}`
          }}
          whileTap={{ scale: 0.9 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;