import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as UAParser from 'ua-parser-js';

const VisitorTracker = ({ apiKey }) => {
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    const getUtmParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        const value = urlParams.get(param);
        if (value) utmParams[param] = value;
      });
      return utmParams;
    };

    const urlParams = new URLSearchParams(window.location.search);

    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
        return data.ip;
      } catch (err) {
        console.error('Failed to fetch IP:', err);
        return '';
      }
    };

    const fallbackToImagePixel = (queryParams) => {
      try {
        const pixelUrl = `https://tracking-go-api.onrender.com/track?${queryParams.toString()}&fallback=true`;
        const img = new Image();
        img.src = pixelUrl;
      } catch (err) {
        console.warn('Fallback image tracking failed:', err);
      }
    };

    const trackVisit = async () => {
      const utmParams = getUtmParams();
      const queryParams = new URLSearchParams(utmParams);

      const ip = await getIpAddress();

      const parser = new UAParser.UAParser();
      parser.setUA(navigator.userAgent);
      const os = parser.getOS();
      const browser = parser.getBrowser();
      const device = parser.getDevice();

      // Add fallback for device type
      const deviceType = device.type || (navigator.userAgent.includes('Mobi') ? 'mobile' : 'desktop');

      const source = urlParams.get('source') || 'website';
      queryParams.append('source', source);

      const requestBody = JSON.stringify({
        userAgent: navigator.userAgent,
        operatingSystem: `${os.name} ${os.version}`,
        browserVersion: `${browser.name} ${browser.version}`,
        deviceType,
        ipAddress: ip
      });

      const trackingUrl = `https://trackapi-3xr4.onrender.com/track?${queryParams.toString()}`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

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

        clearTimeout(timeout);

        if (!response.ok) {
          console.warn('Non-OK response from tracking server:', response.status);
        }
      } catch (err) {
        console.warn('Tracking failed, falling back:', err.name);
        fallbackToImagePixel(queryParams);
      }
    };

    const timeoutId = setTimeout(trackVisit, 1500);
    return () => clearTimeout(timeoutId);
  }, [apiKey]);

  return null;
};

VisitorTracker.propTypes = {
  apiKey: PropTypes.string.isRequired,
};

export default VisitorTracker;