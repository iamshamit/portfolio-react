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
        
        // Add API key as query parameter (alternative to header)
        queryParams.append('api_key', apiKey);
        
        // Create the request URL with API key included in query
        const trackingUrl = `https://tracking-go-api.onrender.com/track?${queryParams.toString()}`;
        
        // Use a fallback approach to CORS issues - IMG tag method
        // This avoids preflight requests entirely but only works for GET requests
        const img = new Image();
        img.src = trackingUrl;
        img.style.display = 'none';
        img.onerror = () => {
          // This will often trigger but the request still goes through
          console.log("Tracking request sent");
        };
        document.body.appendChild(img);
        setTimeout(() => document.body.removeChild(img), 5000);
        
        // Fallback method if you still want to try fetch
        setTimeout(async () => {
          try {
            const response = await fetch(trackingUrl, {
              method: 'GET',
              mode: 'no-cors', // Important - this will make the request succeed but response will be opaque
              cache: 'no-cache',
              credentials: 'omit',
            });
            console.log("Fetch tracking attempt completed");
          } catch (err) {
            // Ignore errors - the image method above is our primary method
          }
        }, 500);
        
      } catch (error) {
        // Silent fail - don't disrupt user experience if tracking fails
        console.error('Error setting up tracking:', error);
      }
    };

    // Track the visit when component mounts
    if (apiKey) {
      trackVisit();
    }
    
  }, [apiKey]); // Include apiKey in dependencies

  // This component doesn't render anything
  return null;
};

export default VisitorTracker;