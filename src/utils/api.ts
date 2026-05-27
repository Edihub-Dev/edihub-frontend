/**
 * Utility to get the correct API URL based on the environment.
 * Automatically switches between Localhost and Production.
 * Defaults to https://end-tribunal-tba-africa.trycloudflare.com/api if VITE_API_URL is not set.
 */
export const getApiUrl = () => {
  // If running on localhost in the browser, always default to the local backend port 5000,
  // unless VITE_API_URL is explicitly set to a different localhost/127.0.0.1 port.
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      return envUrl;
    }
    return 'http://localhost:5000/api';
  }

  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    console.warn('VITE_API_URL is not set, defaulting to http://localhost:5000/api');
    return 'http://localhost:5000/api';
  }
  return url;
};



