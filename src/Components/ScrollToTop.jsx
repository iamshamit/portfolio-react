import { useEffect } from 'react';

const ScrollToTop = () => {
  useEffect(() => {
    // Use event delegation on the document to catch all hash link clicks
    const handleClick = (e) => {
      // Find if the click was on an anchor or inside an anchor
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');

      // Skip if it's just "#" with no specific target
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

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

    // Use event delegation on document
    document.addEventListener('click', handleClick);

    // Clean up event listener
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ScrollToTop;