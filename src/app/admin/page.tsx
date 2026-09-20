"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, LayoutList, Clock, Banknote, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import UserDetailModal from '@/components/admin/UserDetailModal';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import Loader from '@/components/Loader';
export default function AdminPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    pendingWithdrawals: 0,
    totalEarnings: 0,
    totalSiteVisits: 0,
    activeUsersOnline: 0,
    activeUsersList: [] as any[],
    visitorLogs: [] as any[],
    chartData: []
  });
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [offerwalls, setOfferwalls] = useState([
    { name: 'TheoremReach', status: 'active', desc: 'Premium survey inventory with high completion rates.', rev: '20%' },
    { name: 'BitLabs', status: 'active', desc: 'Global surveys with high rewards.', rev: '15%' },
    { name: 'CPX Research', status: 'coming_soon', desc: 'Leading survey provider for micro-tasks.', rev: '18%' },
    { name: 'TimeWall', status: 'active', desc: 'PTC, Tasks, and Surveys wall.', rev: '10%' }
  ]);
  const [configuringWall, setConfiguringWall] = useState<any>(null);
  const [editRev, setEditRev] = useState('');
  const [configWallSavedAlert, setConfigWallSavedAlert] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }
    fetchAdminData(adminToken);
  }, [router]);

  const fetchAdminData = async (token: string) => {
    try {
      const [statsRes, usersRes, withdrawalsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/withdrawals', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const withdrawalsData = await withdrawalsRes.json();

      setStats(statsData.stats || stats);
      setUsers(usersData.users || []);
      setWithdrawals(withdrawalsData.withdrawals || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalAction = async (id: string, action: 'approve' | 'reject') => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchAdminData(token!);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setTheme('system');
    router.push('/admin/login');
  };

  if (loading) {
    return <Loader />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutList, color: 'text-blue-500' },
    { id: 'users', label: `Users (${users.length})`, icon: Users, color: 'text-purple-500' },
    { id: 'offerwalls', label: 'Offerwalls', icon: CheckCircle, color: 'text-pink-500' },
    { id: 'gateways', label: 'Payment APIs', icon: Banknote, color: 'text-amber-500' },
    { id: 'withdrawals', label: `Withdrawals (${withdrawals.filter(w=>w.status === 'pending').length})`, icon: Clock, color: 'text-orange-500' },
    { id: 'analytics', label: `Live Visits (${stats.totalSiteVisits || 0})`, icon: Users, color: 'text-blue-400' },
    { id: 'online', label: `Online Now (${stats.activeUsersOnline || 0})`, icon: CheckCircle, color: 'text-emerald-500' }
  ];

  return (
    <div className="min-h-screen font-sans pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="pt-6 px-4 relative z-50">
        <div className="glass-panel p-5 max-w-7xl mx-auto flex items-center justify-between rounded-3xl relative">
          <div>
            <h1 className="text-3xl font-extrabold text-dynamic tracking-tight">Admin Console</h1>
            <p className="text-dynamic-sec text-sm font-medium mt-1">Superuser Management</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-red-500 hover:bg-red-500/10 border-red-500/20 font-bold transition-all text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Navigation Tabs - Premium Cards */}
        <div className="flex overflow-x-auto gap-4 mb-8 no-scrollbar pb-6 px-2 -mx-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[130px] relative overflow-hidden p-5 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border ${
                activeTab === tab.id
                  ? 'bg-dynamic/10 border-dynamic shadow-[0_0_30px_var(--glow-color)] z-10'
                  : 'glass border-transparent hover:border-dynamic/30'
              }`}
            >
              <div className={`p-3.5 rounded-2xl ${activeTab === tab.id ? 'bg-dynamic text-[var(--bg-primary)] shadow-lg' : `bg-dynamic/10 ${tab.color}`} transition-all duration-300`}>
                <tab.icon size={26} strokeWidth={2.5} />
              </div>
              <span className={`text-xs font-extrabold tracking-wide text-center uppercase ${activeTab === tab.id ? 'text-dynamic' : 'text-dynamic-sec'}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                 <div className="absolute -bottom-1 w-1/2 h-1.5 bg-dynamic rounded-t-full shadow-[0_0_15px_var(--glow-color)]" />
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Tasks Done', value: stats.totalTasks, icon: LayoutList, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Pending Payouts', value: stats.pendingWithdrawals, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Total Volume', value: `PKR ${stats.totalEarnings}`, icon: Banknote, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Total Paid Out', value: `PKR ${withdrawals.filter(w => w.status === 'completed').reduce((acc, w) => acc + w.amount, 0)}`, icon: Banknote, color: 'text-blue-500', bg: 'bg-blue-500/10' }
              ].map((stat, i) => (
                <div key={i} className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:shadow-[0_0_30px_var(--glow-color)] transition-all">
                  <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform`}></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-dynamic-sec text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-extrabold text-dynamic tracking-tight mt-1">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="glass-panel rounded-3xl p-6 lg:p-8 animate-fade-in-up delay-100">
              <h3 className="font-extrabold text-dynamic text-xl mb-6">Revenue Over Time (Last 7 Days)</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-start)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent-start)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val)=>`PKR ${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--glass-border)', borderRadius: '1rem', color: 'var(--text-primary)' }}
                      itemStyle={{ color: 'var(--accent-start)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--accent-start)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-dynamic bg-white/5 dark:bg-black/20">
              <h3 className="font-extrabold text-dynamic text-xl">User Management</h3>
              <p className="text-sm text-dynamic-sec mt-1">Click on a user to view full history and manage status.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-dynamic/5">
                    <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">Current Bal</th>
                    <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">Net Earned</th>
                    <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">Gross (w/ Comm)</th>
                    <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dynamic/20">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-dynamic/5 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-dynamic text-sm">{user.name}</p>
                        <p className="text-xs text-dynamic-sec">{user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-dynamic">PKR {user.balance}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-500">PKR {(user.totalNetEarnings || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-purple-500">PKR {(user.totalGrossEarnings || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedUserId(user.id)}
                          className="text-xs font-bold px-4 py-2 glass rounded-lg text-dynamic hover:bg-dynamic hover:text-white transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Offerwalls Tab */}
        {activeTab === 'offerwalls' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-extrabold text-dynamic text-2xl tracking-tight">Partner Offerwalls</h3>
                  <p className="text-sm text-dynamic-sec mt-1">Manage survey partners and offerwall status</p>
                </div>
                <button className="btn-primary py-2 px-5 text-sm rounded-xl">Add Partner</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offerwalls.map((wall, idx) => (
                  <div key={idx} className="glass p-6 rounded-2xl border border-dynamic flex flex-col hover:shadow-[0_0_20px_var(--glow-color)] transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-dynamic text-lg">{wall.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        wall.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        {wall.status === 'active' ? 'Active' : 'Coming Soon'}
                      </span>
                    </div>
                    <p className="text-xs text-dynamic-sec mb-6 flex-1 leading-relaxed">{wall.desc}</p>
                    <div className="pt-4 border-t border-dynamic flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-dynamic-sec">Commission</p>
                        <p className="text-sm font-bold text-dynamic">{wall.rev}</p>
                      </div>
                      <button 
                        onClick={() => { setConfiguringWall(wall); setEditRev(wall.rev); }}
                        className="text-xs font-bold text-blue-500 hover:text-blue-400"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment Gateways Tab */}
        {activeTab === 'gateways' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-extrabold text-dynamic text-2xl tracking-tight">Payment API Integrations</h3>
                  <p className="text-sm text-dynamic-sec mt-1">Configure automated disbursement gateways</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Easypaisa API', status: 'Test Mode', desc: 'B2C Disbursement API for Easypaisa transfers.', type: 'REST' },
                  { name: 'JazzCash API', status: 'Test Mode', desc: 'B2C Disbursement API for JazzCash transfers.', type: 'REST' }
                ].map((gateway, idx) => (
                  <div key={idx} className="glass p-6 rounded-2xl border border-dynamic flex flex-col hover:shadow-[0_0_20px_var(--glow-color)] transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-dynamic text-lg">{gateway.name}</h4>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-amber-500/10 text-amber-500 border-amber-500/20">
                        {gateway.status}
                      </span>
                    </div>
                    <p className="text-xs text-dynamic-sec mb-6 flex-1 leading-relaxed">{gateway.desc}</p>
                    <div className="pt-4 border-t border-dynamic flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-dynamic-sec">Protocol</p>
                        <p className="text-sm font-bold text-dynamic">{gateway.type}</p>
                      </div>
                      <button 
                        disabled
                        className="text-xs font-bold text-dynamic-sec cursor-not-allowed opacity-50"
                      >
                        Requires Keys
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6 animate-fade-in-up">
            {withdrawals.filter(w => w.status === 'pending').map((w) => (
              <div key={w.id} className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-[0_0_20px_var(--glow-color)] transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border-amber-500/30 text-amber-500">
                    <Clock size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-extrabold text-dynamic tracking-tight">PKR {w.amount}</h4>
                    <p className="text-sm font-semibold text-dynamic-sec mt-1">{w.method} • User {w.user?.name || w.userId}</p>
                    <div className="mt-2 inline-flex px-3 py-1 bg-dynamic/5 rounded-lg border border-dynamic">
                      <p className="text-xs font-mono text-dynamic">{w.accountDetails}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleWithdrawalAction(w.id, 'approve')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
                  >
                    <CheckCircle size={18}/> Approve
                  </button>
                  <button 
                    onClick={() => handleWithdrawalAction(w.id, 'reject')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 glass text-red-500 border-red-500/30 font-bold rounded-xl hover:bg-red-500/10 transition-all"
                  >
                    <XCircle size={18}/> Reject
                  </button>
                </div>
              </div>
            ))}
            {withdrawals.filter(w => w.status === 'pending').length === 0 && (
              <div className="glass-panel rounded-3xl p-12 text-center">
                <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold text-dynamic">All Caught Up!</h3>
                <p className="text-dynamic-sec mt-2">No pending withdrawals to process.</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics & Online Tabs Content */}
        {activeTab === 'analytics' && (
          <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in-up">
            <div className="p-8 text-center border-b border-dynamic bg-white/5 dark:bg-black/20">
              <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                <Users size={32} className="text-blue-500" />
              </div>
              <h3 className="text-3xl font-extrabold text-dynamic">Total Today: {stats.totalSiteVisits || 0}</h3>
              <p className="text-dynamic-sec mt-2 font-medium">Total visits to the platform today, including anonymous traffic.</p>
            </div>

            <div className="p-6">
              <h4 className="font-bold text-dynamic mb-4 text-lg">Recent Visitors (IP Logs)</h4>
              {stats.visitorLogs && stats.visitorLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-dynamic/5">
                        <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">IP Address</th>
                        <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">Time</th>
                        <th className="px-6 py-4 text-xs font-bold text-dynamic-sec uppercase tracking-wider">Device / Browser</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dynamic/20">
                      {stats.visitorLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-dynamic/5 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-bold text-dynamic bg-dynamic/10 px-3 py-1 rounded-lg">
                              {log.ipAddress}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-dynamic">
                            {new Date(log.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>
                          <td className="px-6 py-4 text-xs text-dynamic-sec max-w-xs truncate" title={log.userAgent}>
                            {log.userAgent}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-dynamic-sec font-medium">No IP logs available yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'online' && (
          <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-dynamic bg-white/5 dark:bg-black/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center relative">
                <div className="absolute w-3 h-3 bg-emerald-500 rounded-full animate-pulse top-0 right-0"></div>
                <Users size={24} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-dynamic text-xl">Active Users Now ({stats.activeUsersOnline || 0})</h3>
                <p className="text-sm text-dynamic-sec mt-1">Users who have been active in the last 15 minutes.</p>
              </div>
            </div>
            
            <div className="p-6">
              {stats.activeUsersList && stats.activeUsersList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.activeUsersList.map((user: any) => (
                    <div key={user.id} className="glass p-4 rounded-xl flex items-center justify-between border border-emerald-500/20 hover:border-emerald-500/50 transition-colors cursor-pointer" onClick={() => setSelectedUserId(user.id)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dynamic/10 flex items-center justify-center font-bold text-dynamic">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-dynamic text-sm">{user.name}</p>
                          <p className="text-xs text-dynamic-sec">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-emerald-500 mb-1">Online</span>
                        <span className="text-xs text-dynamic-sec">
                          {new Date(user.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-dynamic-sec font-medium">No users are currently online.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedUserId && (
        <UserDetailModal 
          userId={selectedUserId} 
          token={localStorage.getItem('adminToken')!} 
          onClose={() => setSelectedUserId(null)}
          onUpdate={() => fetchAdminData(localStorage.getItem('adminToken')!)}
        />
      )}

      {/* Configure Offerwall Modal */}
      {configuringWall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 relative">
            <h3 className="text-2xl font-extrabold text-dynamic mb-2">Configure {configuringWall.name}</h3>
            <p className="text-sm text-dynamic-sec mb-6">Update the commission settings for this partner.</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-dynamic-sec uppercase tracking-wider mb-2">Commission Rate</label>
                <input 
                  type="text" 
                  value={editRev} 
                  onChange={(e) => setEditRev(e.target.value)} 
                  className="w-full bg-dynamic/5 border border-dynamic rounded-xl px-4 py-3 text-dynamic font-bold focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 25%"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfiguringWall(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold glass text-dynamic hover:bg-dynamic hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setOfferwalls(prev => prev.map(w => w.name === configuringWall.name ? { ...w, rev: editRev } : w));
                  setConfigWallSavedAlert(true);
                  setConfiguringWall(null);
                  setTimeout(() => setConfigWallSavedAlert(false), 3000);
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {configWallSavedAlert && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 animate-fade-in-up z-50">
          <CheckCircle size={20} /> Settings Saved
        </div>
      )}
    </div>
  );
}