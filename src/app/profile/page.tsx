"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { UserCircle, Mail, Lock, ShieldCheck, CheckCircle, LogOut, Camera, Key } from 'lucide-react';
import Loader from '@/components/Loader';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    oldPassword: '',
    password: '',
    avatar: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        name: data.profile.name || '',
        email: data.profile.email || '',
        avatar: data.profile.avatar || ''
      }));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const updatePayload: any = { 
        name: formData.name,
        avatar: formData.avatar
      };
      
      if (formData.password) {
        if (!formData.oldPassword) {
          throw new Error('Old password is required to change password');
        }
        updatePayload.password = formData.password;
        updatePayload.oldPassword = formData.oldPassword;
      }

      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, oldPassword: '', password: '' })); // Clear password fields after save
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen font-sans pb-32 animate-fade-in-up">
      {/* Header */}
      <div className="pt-6 px-4 relative z-10">
        <div className="glass-panel p-5 max-w-md mx-auto flex items-center justify-between rounded-3xl">
          <div>
            <h1 className="text-2xl font-extrabold text-dynamic tracking-tight">Profile</h1>
            <p className="text-dynamic-sec text-sm font-medium mt-1">Manage your account</p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-8">
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center mb-8 relative z-10">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--accent-start)] to-[var(--accent-end)] flex items-center justify-center mb-4 shadow-[0_0_30px_var(--glow-color)] p-1 transition-transform group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden relative">
                  {formData.avatar ? (
                    <Image src={formData.avatar} alt="Profile Avatar" fill className="object-cover" />
                  ) : (
                    <Image src="/man.png" alt="Default Avatar" fill className="object-cover p-1" />
                  )}
                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </div>
            
            <h2 className="text-xl font-extrabold text-dynamic">{formData.name}</h2>
            <div className="flex items-center gap-1 mt-1 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
              <ShieldCheck size={14} /> Verified User
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-5 relative z-10">
            
            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm border border-red-500/20 text-center font-bold">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl text-sm border border-emerald-500/20 text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle size={16} /> {success}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-dynamic-sec uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-dynamic/5 border border-dynamic rounded-xl focus:ring-2 focus:ring-[var(--accent-start)] focus:border-transparent outline-none text-dynamic font-semibold transition-all"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dynamic-sec uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec opacity-50" />
                <input
                  type="email"
                  disabled
                  className="w-full pl-11 pr-4 py-3.5 bg-dynamic/10 border border-transparent rounded-xl outline-none text-dynamic font-semibold opacity-60 cursor-not-allowed"
                  value={formData.email}
                />
              </div>
              <p className="text-[10px] text-dynamic-sec mt-1 px-1">Email cannot be changed.</p>
            </div>

            <div className="pt-4 border-t border-[var(--glass-border)]">
              <h3 className="text-sm font-bold text-dynamic mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-dynamic-sec uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec" />
                    <input
                      type="password"
                      className="w-full pl-11 pr-4 py-3.5 bg-dynamic/5 border border-dynamic rounded-xl focus:ring-2 focus:ring-[var(--accent-start)] focus:border-transparent outline-none text-dynamic font-semibold transition-all"
                      placeholder="Required to change password"
                      value={formData.oldPassword}
                      onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dynamic-sec uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dynamic-sec" />
                    <input
                      type="password"
                      className="w-full pl-11 pr-4 py-3.5 bg-dynamic/5 border border-dynamic rounded-xl focus:ring-2 focus:ring-[var(--accent-start)] focus:border-transparent outline-none text-dynamic font-semibold transition-all"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary py-4 rounded-xl font-bold text-base tracking-wide transition-all disabled:opacity-50 mt-6 shadow-lg shadow-[var(--glow-color)]"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
          >
            <LogOut size={18} /> Log Out Account
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
