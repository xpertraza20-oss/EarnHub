"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Shield, Gift, ArrowRight, Download, Wallet, TrendingUp, Star, ChevronRight, Gamepad2, MessageSquare, FileSignature, ListTodo } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const taskTypes = [
    { icon: <MessageSquare size={32} style={{ color: 'var(--accent-start)' }} />, title: "Premium Surveys", desc: "Share your opinion on top brands and earn high-paying rewards instantly.", glow: "group-hover:border-b-4 group-hover:border-[var(--accent-start)]" },
    { icon: <Download size={32} style={{ color: 'var(--accent-end)' }} />, title: "App Installs", desc: "Test new applications and games. Get paid for every successful download.", glow: "group-hover:border-b-4 group-hover:border-[var(--accent-end)]" },
    { icon: <Gamepad2 size={32} style={{ color: 'var(--accent-start)' }} />, title: "Play Games", desc: "Reach specific levels in popular mobile games to unlock massive payouts.", glow: "group-hover:border-b-4 group-hover:border-[var(--accent-start)]" },
  ];

  const steps = [
    { num: "1", title: "Sign Up Free", desc: "Create your account in seconds" },
    { num: "2", title: "Complete Tasks", desc: "Choose from hundreds of tasks" },
    { num: "3", title: "Earn Rewards", desc: "Withdraw real money instantly" },
  ];

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden font-sans">
      {/* Premium Web3 Navigation Bar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-lg">
            <Wallet size={24} strokeWidth={2.5} style={{ color: 'var(--accent-start)' }} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-dynamic drop-shadow-[0_0_10px_var(--glow-color)]">EarnHub</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-dynamic-sec font-bold hover:text-dynamic transition-colors">Login</Link>
            <Link href="/signup" className="btn-primary py-2.5 px-8">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Anti-Gravity Hero Section */}
      <div className="relative pt-12 pb-16 lg:pt-24 lg:pb-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-20">
          
          {/* Left Content */}
          <div className={`flex-1 text-center lg:text-left transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in-up">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'var(--accent-start)' }}></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-start)' }}>Web3 Earning Protocol</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight text-dynamic leading-tight drop-shadow-md">
              Task Karo,<br />
              <span className="text-gradient">Reward</span> Kamao.
            </h1>
            <p className="text-dynamic-sec text-lg lg:text-xl font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Join the next generation of online earning. High-paying offers, instant withdrawals, and absolute security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up delay-200">
              <Link href="/signup" className="flex items-center justify-center gap-3 w-full sm:w-auto btn-primary py-4 px-10 text-lg">
                Start Earning Now <ArrowRight size={22} />
              </Link>
              <Link href="/login" className="flex items-center justify-center gap-2 w-full sm:w-auto btn-secondary py-4 px-10 text-lg md:hidden">
                Login
              </Link>
            </div>
          </div>

          {/* Right Content (Floating 3D Earnings Widget) */}
          <div className="flex-1 relative w-full max-w-md lg:max-w-none flex flex-col items-center justify-center lg:items-end mt-12 lg:mt-0">
            <div className="relative w-full max-w-sm">
              <div className="w-full glass-panel p-8 rounded-[3rem] relative z-10 animate-float shadow-2xl">
                {/* 3D Accents */}
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-3xl rotate-12 -z-10 blur-md bg-glow" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full -z-10 blur-xl bg-glow opacity-50" />
                
                <div className="w-full aspect-square glass rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--glass-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--glass-border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
                  
                  <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-4 z-10" style={{ background: 'linear-gradient(to bottom right, var(--accent-start), var(--accent-end))' }}>
                    <Wallet size={48} strokeWidth={3} className="text-white drop-shadow-md" />
                  </div>
                  <p className="text-3xl font-extrabold text-dynamic z-10 drop-shadow-sm">Rs 2,500</p>
                  <p className="text-sm font-bold z-10 mt-2 px-4 py-1.5 rounded-full border border-dynamic shadow-sm bg-[var(--glass-bg)]" style={{ color: 'var(--accent-start)' }}>+ Earned Today</p>
                </div>
              </div>

              {/* Pulsing Shadow beneath the widget */}
              <div className="w-3/4 h-8 mx-auto rounded-full blur-[20px] mt-10 animate-shadow-pulse bg-glow" />
            </div>
          </div>

        </div>
      </div>

      {/* Stats Section (Floating Pill) */}
      <div className="max-w-4xl mx-auto px-4 relative z-30 -mt-10 mb-12">
        <div className="glass-panel rounded-full py-4 px-8 md:px-12 flex flex-wrap items-center justify-between gap-4 md:gap-8 animate-float">
          <div className="flex-1 min-w-[100px] text-center">
            <p className="text-3xl lg:text-4xl font-extrabold text-gradient mb-0.5">50K+</p>
            <p className="text-dynamic-sec text-[10px] font-bold uppercase tracking-widest">Active Wallets</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-[var(--glass-border)]" />
          <div className="flex-1 min-w-[100px] text-center">
            <p className="text-3xl lg:text-4xl font-extrabold text-gradient mb-0.5">Rs 10L</p>
            <p className="text-dynamic-sec text-[10px] font-bold uppercase tracking-widest">Paid Out</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-[var(--glass-border)]" />
          <div className="flex-1 min-w-[100px] text-center">
            <p className="text-3xl lg:text-4xl font-extrabold text-gradient mb-0.5">4.8★</p>
            <p className="text-dynamic-sec text-[10px] font-bold uppercase tracking-widest">App Rating</p>
          </div>
        </div>
      </div>

      {/* Quick Tasks Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-dynamic tracking-tight mb-4 drop-shadow-sm">Why Choose EarnHub?</h2>
          <p className="text-dynamic-sec font-medium max-w-2xl mx-auto">Explore high-paying quick tasks across multiple categories.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {taskTypes.map((t, i) => (
            <div key={i} className={`glass p-10 rounded-[2rem] flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 ease-out group relative overflow-hidden shadow-lg ${t.glow}`}>
              <div className="w-20 h-20 bg-[var(--glass-bg)] rounded-3xl flex items-center justify-center mb-6 border border-dynamic shadow-inner group-hover:scale-110 transition-transform duration-500">
                {t.icon}
              </div>
              <h3 className="font-extrabold text-dynamic text-2xl mb-3">{t.title}</h3>
              <p className="text-dynamic-sec font-medium leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partnered Offerwalls & Supported Payouts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-24 text-center">
        <h3 className="text-sm font-bold text-dynamic-sec uppercase tracking-widest mb-8">Partnered Offerwalls</h3>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {['BitLabs', 'TimeWall', 'CPX Research', 'Torox'].map((partner, i) => (
            <div key={i} className="px-6 py-3 glass rounded-full text-dynamic-sec font-extrabold text-lg tracking-wide hover:text-dynamic transition-all cursor-default hover:bg-[var(--glass-bg)]">
              {partner}
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-dynamic-sec uppercase tracking-widest mt-16 mb-8">Supported Payouts</h3>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {['JazzCash', 'Easypaisa', 'SadaPay', 'NayaPay'].map((payout, i) => (
            <div key={i} className="px-8 py-4 glass-panel rounded-2xl flex items-center gap-3 animate-float" style={{ animationDelay: `${i * 1}s` }}>
              <Wallet size={24} style={{ color: 'var(--accent-start)' }} />
              <span className="font-extrabold text-dynamic text-xl">{payout}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Offerwall Tasks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-32">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-dynamic tracking-tight mb-2 drop-shadow-sm">High-Yield Offers</h2>
            <p className="text-dynamic-sec font-medium">Complete these premium offers right now.</p>
          </div>
          <Link href="/tasks" className="font-bold transition-colors flex items-center gap-1" style={{ color: 'var(--accent-start)' }}>
            View All <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {[
            { title: 'Install & Play', reward: 'Rs 150', category: 'Games', icon: <Gamepad2 size={24}/> },
            { title: 'DeFi Survey', reward: 'Rs 80', category: 'Surveys', icon: <MessageSquare size={24}/> },
            { title: 'Sign Up Bonus', reward: 'Rs 200', category: 'Offers', icon: <FileSignature size={24}/> },
            { title: 'Watch Videos', reward: 'Rs 50', category: 'Media', icon: <ListTodo size={24}/> }
          ].map((task, i) => (
            <div key={i} className="glass p-6 rounded-[2rem] cursor-pointer transform hover:-translate-y-4 hover:shadow-[0_20px_40px_var(--glow-color)] transition-all duration-500 ease-out group relative overflow-hidden">
              <div className="w-14 h-14 bg-[var(--glass-bg)] rounded-2xl flex items-center justify-center mb-5 border border-dynamic group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--accent-start)' }}>
                {task.icon}
              </div>
              <div className="inline-block px-3 py-1 bg-[var(--glass-bg)] text-dynamic-sec text-xs font-bold rounded-full mb-3 uppercase tracking-wider border border-dynamic">
                {task.category}
              </div>
              <h3 className="font-extrabold text-dynamic text-xl mb-1">{task.title}</h3>
              <p className="text-3xl font-extrabold mt-4 text-gradient">{task.reward}</p>
              <div className="mt-6 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" style={{ color: 'var(--accent-start)' }}>
                Start Offer <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-32 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-dynamic tracking-tight mb-4 drop-shadow-sm">How It Works</h2>
          <p className="text-dynamic-sec font-medium max-w-2xl mx-auto">Three simple steps to start earning today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-20 right-20 h-px bg-[var(--glass-border)] z-0" />
          
          {steps.map((s, i) => (
            <div key={i} className="glass !p-8 rounded-[2rem] flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 relative z-10 group">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center font-extrabold border shadow-lg text-3xl mb-6 transition-colors duration-300 bg-[var(--glass-bg)] border-dynamic" style={{ color: 'var(--accent-start)' }}>
                {s.num}
              </div>
              <h3 className="font-extrabold text-dynamic text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-dynamic-sec font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t pt-12 pb-8 mt-20 border-dynamic">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wallet size={20} style={{ color: 'var(--accent-start)' }} />
            <span className="font-extrabold text-dynamic">EarnHub</span>
          </div>
          <p className="text-sm font-bold text-dynamic-sec">© 2026 EarnHub Protocol. All rights reserved.</p>
          <div className="flex gap-4 text-sm font-medium text-dynamic-sec">
            <Link href="#" className="hover:opacity-80">Terms</Link>
            <Link href="#" className="hover:opacity-80">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}