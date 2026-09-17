export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Outer glowing rings */}
        <div className="absolute inset-0 rounded-full border-4 border-l-transparent border-r-transparent animate-spin-slow" style={{ borderColor: 'var(--accent-start)' }} />
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-b-transparent animate-spin-reverse-slow opacity-60" style={{ borderColor: 'var(--accent-end)' }} />
        
        {/* Bouncing inner liquid drops */}
        <div className="absolute flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full animate-bounce shadow-[0_0_10px_var(--glow-color)]" style={{ backgroundColor: 'var(--accent-start)', animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full animate-bounce shadow-[0_0_10px_var(--glow-color)]" style={{ backgroundColor: 'var(--accent-end)', animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full animate-bounce shadow-[0_0_10px_var(--glow-color)]" style={{ backgroundColor: 'var(--accent-start)', animationDelay: '300ms' }} />
        </div>
      </div>
      <p className="mt-4 text-dynamic-sec font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Loading</p>
    </div>
  );
}
