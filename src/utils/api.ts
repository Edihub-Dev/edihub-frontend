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

export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/')[2] || null;
      }
      if (u.pathname.startsWith('/embed/')) {
        return u.pathname.split('/')[2] || null;
      }
      return u.searchParams.get('v') || null;
    } else if (u.hostname === 'youtu.be') {
      return u.pathname.split('/')[1] || null;
    }
  } catch {}
  return null;
}
