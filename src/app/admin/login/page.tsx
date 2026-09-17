"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans animate-fade-in-up flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--glow-color)] blur-[120px] pointer-events-none -z-10 transition-colors duration-500 opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--glow-color)] blur-[120px] pointer-events-none -z-10 transition-colors duration-500 opacity-60" />
      
      <div className="p-4 flex justify-end">
        <ThemeSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-panel rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden animate-float">
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--glass-bg)] via-transparent to-[var(--glass-bg)] pointer-events-none opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-dynamic/10 border border-dynamic rounded-full mx-auto mb-6 flex items-center justify-center text-dynamic shadow-[0_0_30px_var(--glow-color)]">
                <ShieldCheck size={40} />
              </div>
              <h1 className="text-3xl font-extrabold text-dynamic tracking-tight">Admin Console</h1>
              <p className="text-dynamic-sec mt-2 font-medium">Secure Access Only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl text-sm font-bold text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-dynamic-sec uppercase tracking-wider mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec" />
                  <input
                    type="email"
                    required
                    name="email"
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 bg-dynamic/5 border border-dynamic rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-dynamic font-semibold transition-all"
                    placeholder="admin@earnhub.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dynamic-sec uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec" />
                  <input
                    type="password"
                    required
                    name="password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-4 py-3 bg-dynamic/5 border border-dynamic rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-dynamic font-semibold transition-all"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded bg-dynamic/10 border-dynamic text-blue-500 focus:ring-blue-500 cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm font-semibold text-dynamic-sec group-hover:text-dynamic transition-colors">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-xl font-bold text-lg tracking-wide transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Secure Login'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}