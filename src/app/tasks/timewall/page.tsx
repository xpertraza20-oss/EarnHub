"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import Link from 'next/link';
import { ArrowLeft, Loader2, ExternalLink, ShieldCheck, Zap, Coins } from 'lucide-react';

export default function TimeWallPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserProfile(token);
  }, [router]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.profile);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const placementId = process.env.NEXT_PUBLIC_TIMEWALL_PLACEMENT_ID || '';
  const userId = String(user.id);
  // Using standard TimeWall integration URL
  const offerwallUrl = `https://timewall.io/offerwall/${placementId}?userid=${userId}`;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans pb-24 animate-fade-in-up flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 relative inline-flex animate-fade-in-up">
          <div className="absolute inset-0 bg-dynamic opacity-20 blur-xl animate-pulse rounded-2xl pointer-events-none" style={{ backgroundColor: 'var(--accent-start)' }}></div>
          <Link 
            href="/tasks" 
            className="group relative inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl glass border border-dynamic/50 text-dynamic hover:bg-[var(--glass-bg)] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_var(--glow-color)] transition-all duration-500 font-extrabold tracking-wide"
          >
            <div className="w-8 h-8 rounded-full bg-dynamic/20 flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-2">
              <ArrowLeft size={18} className="text-dynamic" />
            </div>
            <span>Back to Offers</span>
          </Link>
        </div>

        {/* Action Card */}
        <div className="w-full glass-panel rounded-3xl p-8 sm:p-12 border border-dynamic shadow-2xl relative overflow-hidden animate-float">
          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--glass-bg)] via-transparent to-[var(--glass-bg)] pointer-events-none opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6 shadow-[0_0_30px_var(--glow-color)] text-dynamic">
              <Loader2 size={48} className="drop-shadow-lg text-purple-500 animate-spin-slow" />
            </div>

            <h1 className="text-4xl font-extrabold text-dynamic tracking-tight mb-4">TimeWall Offers</h1>
            
            <p className="text-dynamic-sec text-lg mb-10 max-w-xl leading-relaxed">
              Complete micro-tasks, view ads, and take surveys to earn rewards. You will be redirected to our secure partner wall. Once completed, your rewards will be automatically credited to your EarnHub balance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-10 text-left">
              <div className="glass p-4 rounded-xl border border-dynamic flex items-center gap-3">
                <div className="text-emerald-500"><Coins size={24} /></div>
                <div>
                  <h4 className="text-sm font-bold text-dynamic">Small & Fast Tasks</h4>
                  <p className="text-xs text-dynamic-sec mt-0.5">Automated webhook rewards</p>
                </div>
              </div>
              <div className="glass p-4 rounded-xl border border-dynamic flex items-center gap-3">
                <div className="text-blue-500"><ShieldCheck size={24} /></div>
                <div>
                  <h4 className="text-sm font-bold text-dynamic">Secure & Verified</h4>
                  <p className="text-xs text-dynamic-sec mt-0.5">Instant postback processing</p>
                </div>
              </div>
            </div>

            <a 
              href={offerwallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 w-full max-w-sm btn-primary"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center gap-2 text-lg">
                Launch Offerwall <ExternalLink size={20} />
              </span>
            </a>
            
            <p className="text-xs text-dynamic-sec mt-6 font-medium">
              Note: The offerwall will open in a new secure tab.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
