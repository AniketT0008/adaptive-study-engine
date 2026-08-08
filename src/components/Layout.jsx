import { useState } from 'react';
import { toggleSound, isSoundEnabled } from '../utils/audio.js';

export default function Layout({ children }) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const nextState = !soundOn;
    toggleSound(nextState);
    setSoundOn(nextState);
  };

  return (
    <>
      <div className="bg-mesh" />
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0f1117]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="#/" className="flex items-center gap-3 text-white no-underline transition-opacity hover:opacity-80">
            <img src="/logo.png" alt="Synapse Logo" className="h-8 w-8 object-contain rounded-lg shadow-md border border-white/10" />
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Synapse</span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-[var(--color-accent-light)] bg-[rgba(108,92,231,0.2)] px-2 py-0.5 rounded border border-[var(--color-accent)]/30">
              CUTC Transform
            </span>
          </a>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleSound}
              className="text-xs text-[var(--color-text-muted)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-lg border border-white/[0.08] transition-colors flex items-center gap-1.5"
              title="Toggle Audio Feedback"
            >
              <span>{soundOn ? '🔊' : '🔇'}</span>
              <span className="hidden sm:inline">{soundOn ? 'Sound On' : 'Muted'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[#55efc4] shadow-[0_0_6px_rgba(85,239,196,0.6)]" />
              <span className="text-xs font-medium text-[#8b8da3]">Live Engine</span>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
      
      <footer className="border-t border-white/[0.04] py-4 text-center text-xs text-[#8b8da3]">
        CUTC Transform Hackathon 2026 • Synapse — Powered by SM-2 Spaced Repetition & Gemini AI
      </footer>
    </>
  );
}
