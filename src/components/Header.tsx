"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  gradient?: string;
  rightAction?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  showBack = false,
  gradient = "from-blue-600 via-blue-700 to-indigo-800",
  rightAction,
}: HeaderProps) {
  const router = useRouter();

  return (
    <div className={`bg-gradient-to-r ${gradient} text-white relative z-50`}>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />

      <div className="container-mobile pt-12 pb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => router.back()}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
            </div>
          </div>
          {rightAction}
        </div>
      </div>
    </div>
  );
}