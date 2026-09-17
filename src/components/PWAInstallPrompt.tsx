"use client";

import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in PWA standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone || 
                      document.referrer.includes('android-app://');
    
    setIsStandalone(standalone);

    if (standalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show iOS prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
      return;
    }

    // Standard Android/Desktop beforeinstallprompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] animate-fade-in-up shadow-2xl">
      <div className="glass p-4 rounded-2xl border border-dynamic flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-inner">
            <Download size={20} />
          </div>
          <div>
            <h4 className="font-bold text-dynamic text-sm">Install EarnHub</h4>
            {isIOS ? (
              <p className="text-[10px] text-dynamic-sec leading-tight mt-0.5">
                Tap <Share size={10} className="inline mx-0.5" /> and select <b>"Add to Home Screen"</b>
              </p>
            ) : (
              <p className="text-xs text-dynamic-sec">Add to home screen for quick access</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isIOS && (
            <button 
              onClick={handleInstallClick}
              className="btn-primary px-4 py-2 text-xs rounded-xl whitespace-nowrap"
            >
              Install
            </button>
          )}
          <button 
            onClick={() => setShowPrompt(false)}
            className="w-8 h-8 flex items-center justify-center text-dynamic-sec hover:text-dynamic hover:bg-dynamic/10 rounded-full transition-colors bg-white/5"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
