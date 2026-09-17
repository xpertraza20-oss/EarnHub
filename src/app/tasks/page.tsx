"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet, Loader2, ArrowRight, Lock, Target, Flame, Activity, Zap } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Loader from '@/components/Loader';

export default function TasksPage() {
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

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setUser(data.profile);
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-sans animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header with Balance */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-dynamic tracking-tight drop-shadow-sm">Offerwalls</h1>
            <p className="text-dynamic-sec font-medium mt-1">Available Offerwalls - Earn Real Cash</p>
          </div>
          <div className="glass px-5 py-2.5 rounded-full flex items-center gap-3 border border-dynamic shadow-md hover:scale-105 transition-transform cursor-pointer">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--glass-bg)]" style={{ color: 'var(--accent-start)' }}>
              <Wallet size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-dynamic-sec">Balance</p>
              <p className="text-sm font-extrabold text-dynamic">Rs {user.balance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Anti-Gravity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          
          {/* 1. TheoremReach (Active) */}
          <Link href="/tasks/theoremreach" className="block group">
            <div className="glass p-6 rounded-[2rem] border border-dynamic shadow-lg transform hover:-translate-y-2 hover:shadow-[0_10px_30px_var(--glow-color)] transition-all duration-500 ease-out relative overflow-hidden cursor-pointer h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: '1s' }} />
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[var(--glass-bg)] rounded-2xl flex items-center justify-center border border-dynamic group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--accent-start)' }}>
                    <Target size={28} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full border border-red-500/30 text-xs font-bold text-red-400 uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                    <Flame size={14} /> Hot
                  </div>
                </div>
                
                <h3 className="font-extrabold text-dynamic text-2xl mb-2">TheoremReach</h3>
                <p className="text-dynamic-sec font-medium leading-relaxed text-sm">
                  Complete high-paying surveys matched to your profile and earn instant cash rewards.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-dynamic pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-dynamic-sec">Active Now</span>
                <div className="flex items-center text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-start)' }}>
                  Start Earning <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* 2. BitLabs (Active) */}
          <Link href="/tasks/bitlabs" className="block group">
            <div className="glass p-6 rounded-[2rem] border border-dynamic shadow-lg transform hover:-translate-y-2 hover:shadow-[0_10px_30px_var(--glow-color)] transition-all duration-500 ease-out relative overflow-hidden cursor-pointer h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: '1s' }} />
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[var(--glass-bg)] rounded-2xl flex items-center justify-center border border-dynamic group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--accent-start)' }}>
                    <Activity size={28} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full border border-blue-500/30 text-xs font-bold text-blue-400 uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    <Flame size={14} /> New
                  </div>
                </div>
                
                <h3 className="font-extrabold text-dynamic text-2xl mb-2">BitLabs</h3>
                <p className="text-dynamic-sec font-medium leading-relaxed text-sm">
                  Premium global survey inventory with high payouts and instant credit.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-dynamic pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-dynamic-sec">Active Now</span>
                <div className="flex items-center text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-start)' }}>
                  Start Earning <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* 3. CPX Research (Coming Soon) */}
          <div className="glass p-6 rounded-[2rem] border border-dynamic opacity-70 relative overflow-hidden h-full flex flex-col justify-between grayscale-[30%]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-[var(--glass-bg)] rounded-2xl flex items-center justify-center border border-dynamic text-dynamic-sec">
                  <Zap size={28} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full border border-dynamic text-xs font-bold text-dynamic-sec uppercase tracking-widest">
                  <Lock size={12} /> Soon
                </div>
              </div>
              
              <h3 className="font-extrabold text-dynamic text-2xl mb-2">CPX Research</h3>
              <p className="text-dynamic-sec font-medium leading-relaxed text-sm">
                Global market research surveys offering massive rewards. Coming in the next update.
              </p>
            </div>
            <div className="mt-8 border-t border-dynamic pt-4">
              <span className="text-xs font-bold text-dynamic-sec">Currently unavailable</span>
            </div>
          </div>

          {/* 4. TimeWall (Active) */}
          <Link href="/tasks/timewall" className="block group md:col-span-2 lg:col-span-1">
            <div className="glass p-6 rounded-[2rem] border border-dynamic shadow-lg transform hover:-translate-y-2 hover:shadow-[0_10px_30px_var(--glow-color)] transition-all duration-500 ease-out relative overflow-hidden cursor-pointer h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: '1s' }} />
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[var(--glass-bg)] rounded-2xl flex items-center justify-center border border-dynamic group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--accent-start)' }}>
                    <Loader2 size={28} className="animate-spin-slow" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full border border-purple-500/30 text-xs font-bold text-purple-400 uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    <Flame size={14} /> New
                  </div>
                </div>
                
                <h3 className="font-extrabold text-dynamic text-2xl mb-2">TimeWall</h3>
                <p className="text-dynamic-sec font-medium leading-relaxed text-sm">
                  Micro-tasks, clicks, and quick offers. The perfect way to earn small amounts quickly.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-dynamic pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-dynamic-sec">Active Now</span>
                <div className="flex items-center text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-start)' }}>
                  Start Earning <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}