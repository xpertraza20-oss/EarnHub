"use client";

import { useEffect, useRef } from 'react';

export default function AnalyticsTracker() {
  const trackedRef = useRef(false);

  useEffect(() => {
    // Only track once per session load to avoid spamming the DB on fast re-renders
    if (trackedRef.current) return;
    trackedRef.current = true;

    const trackVisit = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers
        });
      } catch (err) {
        // Silently fail for analytics
      }
    };

    trackVisit();

    // Optionally set an interval to update active status if they stay on the page
    // every 5 minutes (300,000 ms)
    const interval = setInterval(trackVisit, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return null; // Invisible component
}
