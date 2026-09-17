"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Copy, Check, Share2, Gift, ArrowRight, Banknote, UserPlus } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import Loader from '@/components/Loader';

export default function ReferralsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      const [profileRes, referralsRes] = await Promise.all([
        fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/referrals', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const profileData = await profileRes.json();
      const referralsData = await referralsRes.json();

      setUser(profileData.user);
      setReferrals(referralsData.referrals || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const copyToClipboard = (text: string) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralCode = () => {
    copyToClipboard(user?.referralCode || '');
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${user?.referralCode}`;
    copyToClipboard(link);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-transparent pb-24">
      {/* Note: Header itself might need dynamic theme support if it uses hardcoded gradients, but we pass ThemeSwitcher anyway */}
      <Header 
        title="Referral Program" 
        subtitle="Invite friends, earn rewards" 
        showBack={true} 
        rightAction={<div className="z-50 relative"><ThemeSwitcher /></div>} 
      />

      {/* Referral Stats */}
      <div className="container-mobile -mt-4 relative z-20">
        <div className="glass-panel p-6 text-center animate-fade-in-up rounded-[2rem]">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-3 border-dynamic shadow-[0_0_15px_var(--glow-color)]">
            <Users size={32} style={{ color: 'var(--accent-start)' }} />
          </div>
          <p className="text-dynamic-sec text-sm font-medium uppercase tracking-wider mt-4">Total Referrals</p>
          <h2 className="text-5xl font-extrabold text-dynamic mt-1 tracking-tight">{referrals.length}</h2>
          <div className="flex items-center justify-center gap-1.5 bg-dynamic/10 px-4 py-2 rounded-full mt-4 mx-auto w-fit border border-dynamic">
            <Banknote size={14} className="text-emerald-500" />
            <span className="text-dynamic font-bold">Earn PKR 10 per referral</span>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="container-mobile mt-6">
        <h3 className="font-extrabold text-dynamic mb-3 px-2">Your Referral Code</h3>
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="flex items-center justify-between glass rounded-xl p-3 pl-5 border border-dynamic shadow-inner">
            <span className="text-2xl font-mono font-extrabold text-dynamic" style={{ color: 'var(--accent-start)' }}>{user?.referralCode}</span>
            <button onClick={copyReferralCode} className="w-12 h-12 glass text-dynamic rounded-xl flex items-center justify-center hover:bg-[var(--glass-bg)] hover:shadow-[0_0_15px_var(--glow-color)] transition-all active:scale-95 border border-dynamic">
              {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Share Link */}
      <div className="container-mobile mt-6">
        <button onClick={copyReferralLink} className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg">
          <Share2 size={22} /> Copy & Share Link
        </button>
      </div>

      {/* How it Works */}
      <div className="container-mobile mt-8">
        <h3 className="font-extrabold text-dynamic mb-4 px-2">How It Works</h3>
        <div className="space-y-4">
          {[
            { num: '1', title: 'Share your code', desc: 'Send to friends & family', icon: <Copy size={18} /> }, 
            { num: '2', title: 'Friend signs up', desc: 'They use your code to register', icon: <UserPlus size={18} /> }, 
            { num: '3', title: 'Earn PKR 10', desc: 'Both get reward bonus', icon: <Gift size={18} /> }
          ].map((s, i) => (
            <div key={i} className="glass-panel rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up" style={{animationDelay: `${(i+1)*100}ms`}}>
              <div className="w-12 h-12 glass rounded-xl flex items-center justify-center font-extrabold text-lg shadow-[0_0_10px_var(--glow-color)]" style={{ color: 'var(--accent-start)' }}>
                {s.num}
              </div>
              <div className="flex-1">
                <p className="font-bold text-dynamic text-base">{s.title}</p>
                <p className="text-sm text-dynamic-sec">{s.desc}</p>
              </div>
              <div className="text-dynamic-sec opacity-50">{s.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral List */}
      <div className="container-mobile mt-8 mb-4">
        <h3 className="font-extrabold text-dynamic mb-4 px-2">Your Referrals</h3>
        {referrals.length === 0 ? (
          <div className="glass-panel rounded-[2rem] text-center py-10">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dynamic">
              <Users size={28} className="text-dynamic-sec" />
            </div>
            <p className="text-dynamic font-bold text-lg">No referrals yet</p>
            <p className="text-dynamic-sec text-sm mt-1">Share your code to start earning</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((r, i) => (
              <div key={r.id} className="glass-panel rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up hover:shadow-[0_0_15px_var(--glow-color)] transition-shadow" style={{animationDelay: `${i*60}ms`}}>
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-dynamic">
                  <span className="font-extrabold text-lg" style={{ color: 'var(--accent-start)' }}>U</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-dynamic">User #{r.referredId}</p>
                  <p className="text-xs text-dynamic-sec mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="px-3 py-1.5 glass rounded-full border border-emerald-500/30">
                  <span className="text-emerald-500 font-bold text-sm">+PKR {r.rewardEarned}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}