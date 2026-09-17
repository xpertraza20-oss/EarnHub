"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, Wallet, Users, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/withdrawals", label: "Withdraw", icon: Wallet },
  { href: "/referrals", label: "Referrals", icon: Users },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const index = navItems.findIndex(item => pathname.startsWith(item.href));
    if (index !== -1) setActiveIndex(index);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-md relative pointer-events-auto">
        
        {/* Animated Curved Navbar Container */}
        <div className="relative h-[72px] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] rounded-t-[2.5rem] flex items-center pb-safe glass-panel border-t border-[var(--glass-border)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          
          {/* Active Indicator Cutout & Floating Bubble */}
          <div 
            className="absolute top-[-28px] left-0 w-[20%] h-full flex justify-center nav-indicator z-10"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          >
            {/* The Floating Bubble */}
            <div 
              className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-[6px]"
              style={{ 
                background: 'linear-gradient(to top right, var(--accent-start), var(--accent-end))',
                borderColor: 'var(--bg-primary)',
                boxShadow: '0 8px 20px var(--glow-color)'
              }}
            >
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex w-full h-full relative z-30">
            {navItems.map((item, index) => {
              const isActive = activeIndex === index;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-1 h-full flex flex-col items-center justify-center relative cursor-pointer group"
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={`transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex flex-col items-center absolute top-1/2 -translate-y-1/2 ${isActive ? '-mt-[33px]' : 'opacity-60 hover:opacity-100'}`}>
                    <Icon 
                      size={24} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={isActive ? 'text-white drop-shadow-md' : 'text-dynamic-sec group-hover:text-dynamic'}
                    />
                  </div>
                  
                  {/* Label that fades in when active */}
                  <span 
                    className={`absolute bottom-2.5 text-[10px] font-bold tracking-wide transition-all duration-300 ${
                      isActive 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={isActive ? { color: 'var(--accent-start)' } : {}}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}