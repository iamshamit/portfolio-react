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
        
        // Make the tracking API request
        const response = await fetch(trackingUrl, {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey,
          },
        });
        
        if (!response.ok) {
          console.error('Visitor tracking failed:', await response.text());
        }
      } catch (error) {
        // Silent fail - don't disrupt user experience if tracking fails
        console.error('Error tracking visitor:', error);
      }
    };

    // Track the visit when component mounts
    trackVisit();
    
    // No cleanup needed
  }, []); // Empty dependency array ensures this runs once on mount

  // This component doesn't render anything
  return null;
};

export default VisitorTracker;