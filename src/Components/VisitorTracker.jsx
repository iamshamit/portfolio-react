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

    // Function to track visitor with image pixel fallback
    const trackVisit = () => {
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

        // First try with fetch API
        const trackWithFetch = async () => {
          try {
            const trackingUrl = `https://tracking-go-api.onrender.com/track?${queryParams.toString()}`;
            
            // Attempt with fetch first
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(trackingUrl, {
              method: 'GET',
              mode: 'cors',
              credentials: 'omit',
              headers: {
                'X-API-Key': apiKey || '',
                'Accept': 'application/json'
              },
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              console.warn('Tracking returned non-OK response:', response.status);
              fallbackToImagePixel();
            }
          } catch (error) {
            console.warn('Fetch tracking failed, using fallback:', error.name);
            fallbackToImagePixel();
          }
        };
        
        // Fallback method using image pixel technique (bypasses CORS)
        const fallbackToImagePixel = () => {
          try {
            const img = new Image();
            const pixelUrl = `https://tracking-go-api.onrender.com/track?${queryParams.toString()}&fallback=true`;
            
            img.src = pixelUrl;
            img.style.display = 'none';
            img.onload = () => {
              console.log('Tracking pixel loaded successfully');
              setTimeout(() => {
                document.body.removeChild(img);
              }, 5000);
            };
            img.onerror = () => {
              console.warn('Tracking pixel failed to load');
              document.body.removeChild(img);
            };
            
            document.body.appendChild(img);
          } catch (imgError) {
            console.warn('Image pixel tracking failed:', imgError);
            // Silent failure - don't impact user experience
          }
        };
        
        // Start with fetch method
        trackWithFetch();
        
      } catch (error) {
        // Silent failure - don't disrupt user experience
        console.warn('Visitor tracking error:', error);
      }
    };

    // Add delay to handle cold starts
    const trackingTimeout = setTimeout(() => {
      trackVisit();
    }, 1500);
    
    return () => clearTimeout(trackingTimeout);
  }, []); // Empty dependency array ensures this runs once on mount

  // This component doesn't render anything
  return null;
};

export default VisitorTracker;