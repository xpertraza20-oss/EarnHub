"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User, Phone, Gift, Eye, EyeOff, Wallet, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: <User size={18} />, placeholder: 'John Doe', required: true },
    { key: 'email', label: 'Email Address', type: 'email', icon: <Mail size={18} />, placeholder: 'you@example.com', required: true },
    { key: 'phone', label: 'Phone (Optional)', type: 'tel', icon: <Phone size={18} />, placeholder: '03XXXXXXXXX', required: false },
    { key: 'password', label: 'Password', type: showPassword ? 'text' : 'password', icon: <Lock size={18} />, placeholder: 'Create password', required: true, hasToggle: true },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: <Lock size={18} />, placeholder: 'Confirm password', required: true },
    { key: 'referralCode', label: 'Referral Code (Optional)', type: 'text', icon: <Gift size={18} />, placeholder: 'Enter code', required: false },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 py-10 relative overflow-hidden font-sans">
      <div className="w-full max-w-md animate-fade-in-up z-10">
        {/* Header / Logo Area */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-dynamic-sec hover:text-dynamic mb-6 transition-colors">
            <ArrowLeft size={18} /> <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div className="w-16 h-16 glass rounded-[1.2rem] flex items-center justify-center mx-auto shadow-lg mb-4">
            <Wallet size={32} style={{ color: 'var(--accent-start)' }} />
          </div>
          <h1 className="text-3xl font-extrabold text-dynamic tracking-tight drop-shadow-sm">Create Account</h1>
          <p className="text-dynamic-sec mt-2 font-medium">Join EarnHub and start earning</p>
        </div>

        {/* Form Card */}
        <div className="glass-panel rounded-[2rem] p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 backdrop-blur-md text-red-400 p-4 rounded-xl text-sm border border-red-500/20 flex items-center gap-2">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-bold text-dynamic mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec">{f.icon}</span>
                  <input
                    type={f.type}
                    required={f.required}
                    className="input-field pl-11 pr-11"
                    placeholder={f.placeholder}
                    value={(formData as any)[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                  />
                  {f.hasToggle && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dynamic-sec hover:opacity-80 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 mt-6 rounded-xl py-4">
              <UserPlus size={20} /> {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 glass p-4 rounded-xl inline-block w-full">
          <p className="text-dynamic-sec font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-start)' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}