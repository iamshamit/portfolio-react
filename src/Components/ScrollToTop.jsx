import { useEffect } from 'react';

const ScrollToTop = () => {
  useEffect(() => {
    // Get all links that have hash (#) in them
    const links = document.querySelectorAll('a[href^="#"]');
    
    const handleClick = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute('href');
      
      // Skip if it's just "#" with no specific target
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Get the target element's position
        const targetPosition = targetElement.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        const distance = targetPosition;
        
        // Implement custom smooth scrolling
        const duration = 800; // ms
        let start = null;
        
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          
          // Easing function - easeInOutCubic
          const easeInOutCubic = (t) => {
            return t < 0.5
              ? 4 * t * t * t
              : 1 - Math.pow(-2 * t + 2, 3) / 2;
          };
          
          const time = Math.min(1, progress / duration);
          const easedTime = easeInOutCubic(time);
          
          window.scrollTo(0, startPosition + distance * easedTime);
          
          if (progress < duration) {
            window.requestAnimationFrame(step);
          } else {
            // Update URL but without causing a jump
            window.history.pushState(null, '', targetId);
          }
        };
        
        window.requestAnimationFrame(step);
      }
    };
    
    // Add event listeners to all hash links
    links.forEach((link) => {
      link.addEventListener('click', handleClick);
    });
    
    // Clean up event listeners
    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default ScrollToTop;