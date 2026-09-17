"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, ArrowDownToLine, Clock, CheckCircle2, XCircle, CreditCard, Smartphone, Building2, X, Banknote } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import Loader from '@/components/Loader';

export default function WithdrawalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    method: 'jazzcash',
    accountNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      const [profileRes, withdrawalsRes] = await Promise.all([
        fetch('/api/user/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/withdrawals', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const profileData = await profileRes.json();
      const withdrawalsData = await withdrawalsRes.json();

      setUser(profileData.user);
      setWithdrawals(withdrawalsData.withdrawals || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Withdrawal failed');
      }

      alert('Withdrawal request submitted successfully!');
      setShowModal(false);
      setFormData({ amount: '', method: 'jazzcash', accountNumber: '' });
      fetchData(token!);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-transparent pb-24">
      <Header title="Withdrawals" subtitle="Withdraw your earnings" gradient="from-blue-600 via-indigo-600 to-purple-600" showBack={false} />

      {/* Balance Card */}
      <div className="container-mobile -mt-4 relative z-20">
        <div className="glass p-7 rounded-[2rem] animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={18} className="text-slate-400" />
            <p className="text-slate-500 text-sm font-medium">Available Balance</p>
          </div>
          <h2 className="text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">PKR {user?.balance || 0}</h2>
          <button
            onClick={() => setShowModal(true)}
            className="w-full btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
            disabled={!user?.balance || user.balance < 100}
          >
            {user?.balance >= 100 ? 'Withdraw Now →' : 'Minimum PKR 100 required'}
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="container-mobile mt-4">
        <h3 className="font-bold text-slate-800 mb-3 px-2">Payment Methods</h3>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: <Smartphone size={24} className="text-emerald-500" />, name: 'JazzCash', bg: 'bg-emerald-50/80 border-emerald-100/50' }, { icon: <Smartphone size={24} className="text-amber-500" />, name: 'Easypaisa', bg: 'bg-amber-50/80 border-amber-100/50' }, { icon: <Building2 size={24} className="text-blue-500" />, name: 'Bank', bg: 'bg-blue-50/80 border-blue-100/50' }].map((m, i) => (
            <div key={i} className="glass rounded-[1.5rem] text-center p-3 animate-fade-in-up hover:bg-white/70 transition-all cursor-pointer" style={{animationDelay: `${i*80}ms`}}>
              <div className={`w-12 h-12 ${m.bg} border rounded-xl flex items-center justify-center mx-auto mb-2 shadow-inner`}>{m.icon}</div>
              <span className="text-xs font-semibold text-slate-700">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="container-mobile mt-4">
        <h3 className="font-bold text-slate-800 mb-3 px-2">History</h3>
        {withdrawals.length === 0 ? (
          <div className="glass rounded-[1.5rem] text-center py-8">
            <div className="w-14 h-14 bg-white/50 border border-white/60 rounded-[1rem] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ArrowDownToLine size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium text-sm">No withdrawals yet</p>
            <p className="text-slate-400 text-xs mt-1">Your withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w, i) => (
              <div key={w.id} className="glass rounded-[1.5rem] p-4 flex items-center gap-4 animate-fade-in-up" style={{animationDelay: `${i*60}ms`}}>
                <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shadow-inner border ${
                  w.status === 'completed' ? 'bg-emerald-50 border-emerald-100' : w.status === 'processing' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  {w.status === 'completed' ? <CheckCircle2 size={20} className="text-emerald-500" /> :
                   w.status === 'processing' ? <Clock size={20} className="text-amber-500" /> :
                   <XCircle size={20} className="text-slate-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">PKR {w.amount}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{w.method} • {w.accountDetails}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                  w.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  w.status === 'processing' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                  'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Withdraw Funds</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitWithdrawal} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (PKR)</label>
                <div className="relative">
                  <Banknote size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" min="100" max={user?.balance || 0} required className="input-field pl-11 bg-white/50" placeholder="Enter amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: 'jazzcash', label: 'JazzCash', icon: <Smartphone size={18} /> }, { value: 'easypaisa', label: 'Easypaisa', icon: <Smartphone size={18} /> }, { value: 'bank', label: 'Bank', icon: <Building2 size={18} /> }].map((m) => (
                    <button key={m.value} type="button" onClick={() => setFormData({ ...formData, method: m.value })} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${formData.method === m.value ? 'border-blue-500 bg-blue-50/80 text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.1)]' : 'border-white bg-white/50 text-slate-500 hover:border-slate-200 hover:bg-white'}`}>
                      {m.icon}
                      <span className="text-xs font-semibold">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {formData.method === 'bank' ? 'IBAN Number' : 'Mobile Number'}
                </label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required className="input-field pl-11 bg-white/50" placeholder={formData.method === 'bank' ? 'PKXX XXXX XXXX XXXX' : '03XXXXXXXXX'} value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50 mt-4 rounded-xl py-3.5">
                {submitting ? 'Processing...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}