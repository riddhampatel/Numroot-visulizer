import React from 'react';
import { Cpu, BookOpen, Sparkles } from 'lucide-react';

export default function Header({ onOpenCSModal, onOpenGuideModal }) {
  return (
    <header className="glass-panel p-4 sm:p-5 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <Cpu size={26} className="text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                NumRoot Visualizer
              </h1>
              <span className="badge badge-indigo">
                <Sparkles size={12} /> Numerical Methods
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Interactive Non-Linear Equation Root-Finding &amp; Convergence Analysis in Computing
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            id="btn-algorithm-guide"
            onClick={onOpenGuideModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer" 
            title="Read mathematical principles & algorithm comparison"
          >
            <BookOpen size={16} className="text-cyan-400" />
            <span>Algorithm Theory &amp; Guide</span>
          </button>

          <button 
            id="btn-cs-applications"
            onClick={onOpenCSModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-cyan-500/30 transition-all duration-200 active:scale-95 cursor-pointer" 
            title="See where root-finding is applied in computer science"
          >
            <Cpu size={16} className="text-white" />
            <span>CS Applications</span>
          </button>
        </div>

      </div>
    </header>
  );
}
