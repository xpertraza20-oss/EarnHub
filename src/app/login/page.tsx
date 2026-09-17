"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, LogIn, Eye, EyeOff, Wallet, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md animate-fade-in-up z-10">
        {/* Header / Logo Area */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-dynamic-sec hover:text-dynamic mb-6 transition-colors">
            <ArrowLeft size={18} /> <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div className="w-16 h-16 glass rounded-[1.2rem] flex items-center justify-center mx-auto shadow-lg mb-4">
            <Wallet size={32} style={{ color: 'var(--accent-start)' }} />
          </div>
          <h1 className="text-3xl font-extrabold text-dynamic tracking-tight drop-shadow-sm">Welcome Back</h1>
          <p className="text-dynamic-sec mt-2 font-medium">Login to your EarnHub account</p>
        </div>

        {/* Form Card */}
        <div className="glass-panel rounded-[2rem] p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 backdrop-blur-md text-red-400 p-4 rounded-xl text-sm border border-red-500/20 flex items-center gap-2">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-dynamic mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec" />
                <input
                  type="email"
                  required
                  className="input-field pl-11"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-dynamic mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-11 pr-11"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dynamic-sec transition-colors hover:opacity-80">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 mt-2 rounded-xl py-4 font-bold">
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  <LogIn size={20} /> Login to Account
                </>
              )}
            </button>
          </form>
        </div>

        {/* Signup Link */}
        <div className="text-center mt-8 glass p-4 rounded-xl inline-block w-full">
          <p className="text-dynamic-sec font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-start)' }}>
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}