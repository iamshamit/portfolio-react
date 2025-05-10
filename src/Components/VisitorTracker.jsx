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
        
        // Use a fallback approach to CORS issues - IMG tag method with API key in header
        const img = new Image();
        // Add API key as a custom attribute (not in URL)
        img.setAttribute('data-api-key', apiKey);
        img.onload = () => {
          console.log("Tracking image loaded successfully");
        };
        img.onerror = () => {
          // This will often trigger but the request may still go through
          console.log("Tracking request sent");
          
          // Make a proper authenticated request as backup
          setTimeout(async () => {
            try {
              const headers = new Headers();
              headers.append('X-API-Key', apiKey);
              
              await fetch(trackingUrl, {
                method: 'GET',
                headers: headers,
                mode: 'no-cors',
                cache: 'no-cache',
                credentials: 'omit',
              });
              console.log("Fetch tracking attempt completed");
            } catch (err) {
              // Ignore errors - the image method is our primary method
            }
          }, 500);
        };
        
        // Set the src to trigger the request - add timestamp to prevent caching
        img.src = `${trackingUrl}&_t=${Date.now()}`;
        img.style.display = 'none';
        document.body.appendChild(img);
        setTimeout(() => {
          if (img.parentNode) {
            document.body.removeChild(img);
          }
        }, 5000);
        
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