import { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as UAParser from 'ua-parser-js';

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

        // Gather visitor information
        const userAgent = navigator.userAgent;
        const parser = new UAParser.UAParser();
        parser.setUA(userAgent);
        const os = parser.getOS();
        const browser = parser.getBrowser();
        const device = parser.getDevice();

        const referer = document.referrer;
        const operatingSystem = os.name + " " + os.version;
        const browserVersion = browser.name + " " + browser.version;
        const deviceType = device.type || "desktop"; // Default to desktop if type is not available

        // Function to get the client's IP address
        const getIp = async () => {
          try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
          } catch (error) {
            console.error('Error getting IP address:', error);
            return '';
          }
        };

        // Construct request body
        const constructRequestBody = async () => {
          const ipAddress = await getIp();

          return JSON.stringify({
            userAgent,
            referer,
            operatingSystem,
            browserVersion,
            deviceType,
            ipAddress, // Include IP address in the request body
          });
        };

        let source = "website";
        if (queryParams.has('utm_source')) {
          source = queryParams.get('utm_source');
        } else if (window.location.search.includes('source=')) {
          const urlParams = new URLSearchParams(window.location.search);
          source = urlParams.get('source') || source;
        }

        // First try with fetch API
        const trackWithFetch = async () => {
          try {
            const requestBody = await constructRequestBody();
            const trackingUrl = `https://tracking-go-api.onrender.com/track?source=${source}&${queryParams.toString()}`;

            // Attempt with fetch first
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(trackingUrl, {
              method: 'POST',
              mode: 'cors',
              credentials: 'omit',
              headers: {
                'X-API-Key': apiKey || '',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: requestBody,
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
        await trackWithFetch();

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

VisitorTracker.propTypes = {
  apiKey: PropTypes.string.isRequired,
};

export default VisitorTracker;
