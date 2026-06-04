/**
 * Utility to get the correct API URL based on the environment.
 * Automatically switches between Localhost and Production.
 * Defaults to https://refinance-marion-elegant-helped.trycloudflare.com/api if VITE_API_URL is not set.
 */
export const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (url) {
    return url;
  }

  // Fallback logic if VITE_API_URL is not set
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }

  console.warn('VITE_API_URL is not set, defaulting to https://refinance-marion-elegant-helped.trycloudflare.com/api');
  return 'https://refinance-marion-elegant-helped.trycloudflare.com/api';
};



