import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Handles scrolling to hash sections when navigating from other routes
const HashScrollHandler = () => {
    const location = useLocation();

    useEffect(() => {
        // Check if there's a hash in the URL
        if (location.hash) {
            // Small delay to ensure the page has rendered
            setTimeout(() => {
                const element = document.querySelector(location.hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else if (location.pathname === '/') {
            // Scroll to top when navigating to home without hash
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]);

    return null;
};

export default HashScrollHandler;
