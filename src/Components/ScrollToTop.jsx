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
        // Scroll smoothly to the element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL but without causing a jump
        window.history.pushState(null, '', targetId);
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