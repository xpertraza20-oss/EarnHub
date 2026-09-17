"use client";

import { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export default function UserDetailModal({ userId, onClose, token, onUpdate }: { userId: string, onClose: () => void, token: string, onUpdate: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'ban' | 'unban') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchUserDetails();
        onUpdate();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl relative p-6">
        <button onClick={onClose} className="absolute top-6 right-6 text-dynamic-sec hover:text-dynamic transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-dynamic tracking-tight">{user.name}</h2>
            <p className="text-sm text-dynamic-sec mt-1">{user.email} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            {user.status === 'active' ? (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 rounded-full text-xs">ACTIVE</span>
            ) : (
              <span className="px-3 py-1 bg-red-500/20 text-red-400 font-bold border border-red-500/30 rounded-full text-xs">BANNED</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass p-4 rounded-2xl border border-dynamic">
            <p className="text-xs font-bold text-dynamic-sec">Balance</p>
            <p className="text-2xl font-bold text-dynamic mt-1">PKR {user.balance}</p>
          </div>
          <div className="glass p-4 rounded-2xl border border-dynamic">
            <p className="text-xs font-bold text-dynamic-sec">Pending</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">PKR {user.pendingBalance}</p>
          </div>
          <div className="glass p-4 rounded-2xl border border-dynamic">
            <p className="text-xs font-bold text-dynamic-sec">Tasks Done</p>
            <p className="text-2xl font-bold text-dynamic mt-1">{user.completedTasks?.length || 0}</p>
          </div>
          <div className="glass p-4 rounded-2xl border border-dynamic">
            <p className="text-xs font-bold text-dynamic-sec">Referrals</p>
            <p className="text-2xl font-bold text-dynamic mt-1">{user.referralCode}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-dynamic mb-3 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-500"/> Recent Tasks</h3>
            <div className="glass border border-dynamic rounded-xl p-2 max-h-48 overflow-y-auto">
              {user.completedTasks?.length > 0 ? user.completedTasks.map((t: any) => (
                <div key={t.id} className="flex justify-between items-center p-2 border-b border-white/10 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-dynamic">{t.provider || 'System'}</p>
                    <p className="text-xs text-dynamic-sec">{new Date(t.completedAt).toLocaleString()}</p>
                  </div>
                  <span className="font-bold text-emerald-400">+PKR {t.rewardAmount}</span>
                </div>
              )) : <p className="text-sm text-dynamic-sec p-2">No tasks completed yet.</p>}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-dynamic mb-3 flex items-center gap-2"><Clock size={18} className="text-amber-500"/> Withdrawal History</h3>
            <div className="glass border border-dynamic rounded-xl p-2 max-h-48 overflow-y-auto">
              {user.withdrawals?.length > 0 ? user.withdrawals.map((w: any) => (
                <div key={w.id} className="flex justify-between items-center p-2 border-b border-white/10 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-dynamic">PKR {w.amount} via {w.method}</p>
                    <p className="text-xs text-dynamic-sec">{new Date(w.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-bold uppercase ${w.status === 'completed' ? 'text-emerald-400' : w.status === 'rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                    {w.status}
                  </span>
                </div>
              )) : <p className="text-sm text-dynamic-sec p-2">No withdrawals yet.</p>}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
          {user.status === 'active' ? (
            <button onClick={() => handleAction('ban')} className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 text-red-500 hover:bg-red-500/30 font-bold rounded-xl transition-all border border-red-500/30">
              <ShieldAlert size={18} /> Ban User
            </button>
          ) : (
            <button onClick={() => handleAction('unban')} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 font-bold rounded-xl transition-all border border-emerald-500/30">
              <CheckCircle size={18} /> Unban User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
