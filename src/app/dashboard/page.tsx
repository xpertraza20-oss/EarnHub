"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Wallet, ListTodo, Users, Clock, Gift, Copy, Check, ArrowUpRight, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import BottomNav from '@/components/BottomNav';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import Loader from '@/components/Loader';

export default function DashboardPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setTheme('system');
    router.push('/');
  };

  if (loading) {
    return <Loader />;
  }

  const actions = [
    { href: '/tasks', icon: <ListTodo size={22} />, label: 'All Tasks', color: 'bg-blue-50 text-blue-600' },
    { href: '/tasks?category=survey', icon: <MessageSquare size={22} />, label: 'Surveys', color: 'bg-purple-50 text-purple-600' },
    { href: '/tasks?category=app', icon: <ArrowUpRight size={22} />, label: 'Apps', color: 'bg-amber-50 text-amber-600' },
    { href: '/referrals', icon: <Users size={22} />, label: 'Referrals', color: 'bg-emerald-50 text-emerald-600' },
  ];

  const copyCode = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-transparent pb-24">
      {/* Header */}
      <div className="relative pt-10 pb-6 px-4 z-50">
        <div className="container-mobile relative glass-panel p-5 mt-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dynamic-sec text-sm font-medium animate-pulse flex items-center gap-1">
                Welcome back <span className="inline-block origin-bottom-right animate-[wave_2s_ease-in-out_infinite]">👋</span>
              </p>
              <h1 className="text-3xl font-black mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] drop-shadow-sm">
                {user?.name || 'User'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <button onClick={handleLogout} className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-dynamic-sec hover:text-dynamic transition-all active:scale-95 shadow-sm border border-dynamic">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="container-mobile -mt-4 relative z-20">
        <div className="glass-panel p-7 rounded-[2rem] animate-fade-in-up delay-100">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={18} className="text-dynamic-sec" />
            <p className="text-dynamic-sec text-sm font-medium">Total Balance</p>
          </div>
          <h2 className="text-5xl font-extrabold text-dynamic mb-4 tracking-tight">PKR {user?.balance || 0}</h2>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 bg-dynamic/10 px-4 py-2 rounded-full border border-dynamic">
              <Clock size={14} className="text-amber-500" />
              <span className="text-dynamic-sec text-xs font-bold uppercase tracking-wider">Pending: PKR {user?.pendingBalance || 0}</span>
            </div>
          </div>
          <Link href="/withdrawals" className="block w-full text-center btn-primary">
            Withdraw Now
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container-mobile mt-4">
        <h3 className="font-extrabold text-dynamic mb-3 px-2">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => (
            <Link key={i} href={a.href} className="glass rounded-2xl p-4 flex items-center gap-3 animate-fade-in-up hover:bg-[var(--glass-bg)] hover:border-dynamic transition-all active:scale-[0.98]" style={{animationDelay: `${(i+2)*100}ms`}}>
              <div className={`w-11 h-11 ${a.color} rounded-xl flex items-center justify-center shadow-sm`}>{a.icon}</div>
              <span className="font-bold text-dynamic text-sm">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Referral Code */}
      <div className="container-mobile mt-4">
        <div className="glass-panel rounded-[2rem] p-5 animate-fade-in-up delay-400">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} className="text-dynamic" style={{ color: 'var(--accent-start)' }} />
            <h3 className="font-extrabold text-dynamic text-sm">Your Referral Code</h3>
          </div>
          <div className="flex items-center justify-between glass rounded-xl p-2 pl-4 border border-dynamic shadow-inner">
            <span className="font-mono font-bold text-dynamic text-lg" style={{ color: 'var(--accent-start)' }}>{user?.referralCode}</span>
            <button onClick={copyCode} className="w-10 h-10 glass text-dynamic rounded-lg flex items-center justify-center hover:bg-[var(--glass-bg)] transition-all active:scale-95 border border-dynamic">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container-mobile mt-4">
        <h3 className="font-extrabold text-dynamic mb-3 px-2">Account Info</h3>
        <div className="glass-panel rounded-[2rem] p-5 space-y-4 animate-fade-in-up delay-500">
          {[
            { label: 'Total Earned', value: `PKR ${user?.balance || 0}`, color: 'text-emerald-500' },
            { label: 'Referral Code', value: user?.referralCode, color: 'text-blue-500' },
            { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', color: 'text-dynamic-sec' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between border-b border-dynamic pb-3 last:border-0 last:pb-0">
              <span className="text-dynamic-sec text-sm font-medium uppercase tracking-wider">{s.label}</span>
              <span className={`font-bold text-sm ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}