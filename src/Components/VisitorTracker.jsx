import { useEffect } from 'react';

const VisitorTracker = ({ apiKey }) => {
  useEffect(() => {
    // Function to get URL parameters
    const getUtmParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {};
      
      // Collect all UTM parameters
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        const value = urlParams.get(param);
        if (value) utmParams[param] = value;
      });
      
      return utmParams;
    };

    // Function to track visitor
    const trackVisit = async () => {
      try {
        const utmParams = getUtmParams();
        
        // Construct query string from UTM parameters
        const queryParams = new URLSearchParams();
        Object.entries(utmParams).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
        
        // Add referrer if available
        if (document.referrer) {
          queryParams.append('referrer', document.referrer);
        }
        
        // Create the request URL
        const trackingUrl = `https://tracking-go-api.onrender.com/track?${queryParams.toString()}`;
        
        // Make the tracking API request with more options for CORS
        const response = await fetch(trackingUrl, {
          method: 'GET',
          mode: 'cors', // Explicitly state we want CORS
          headers: {
            'X-API-Key': apiKey || '',
            'Content-Type': 'application/json'
          },
          // Increased timeout to handle slow server startup on render.com free tier
          signal: AbortSignal.timeout(10000)
        });
        
        if (!response.ok) {
          console.warn('Visitor tracking response not OK:', await response.text());
        }
      } catch (error) {
        // Silent fail - don't disrupt user experience if tracking fails
        // Only log to console if not a network error (might be CORS or server offline)
        if (!(error instanceof TypeError)) {
          console.error('Error tracking visitor:', error);
        }
      }
    };

    // Add a small delay before tracking to ensure page has fully loaded
    // This helps with Render.com's cold starts
    const trackingTimeout = setTimeout(() => {
      trackVisit();
    }, 1000);
    
    return () => clearTimeout(trackingTimeout);
  }, []); // Empty dependency array ensures this runs once on mount

  // This component doesn't render anything
  return null;
};

export default VisitorTracker;