"use client";

import Link from "next/link";
import { Home, ListTodo, Wallet, Users, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/withdrawals", icon: Wallet, label: "Wallet" },
  { href: "/referrals", icon: Users, label: "Referrals" },
];

export default function BottomNav({ active }: { active: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-auto max-w-md">
        <div className="mx-3 mb-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.08)] border border-white/60">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                      : "text-gray-400 hover:text-blue-500"
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}