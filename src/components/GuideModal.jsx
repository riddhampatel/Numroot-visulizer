import React from 'react';
import { X, BookOpen } from 'lucide-react';

export default function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel bg-slate-900/95 border border-indigo-500/30 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/80">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Close guide"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <BookOpen size={22} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Mathematical Algorithm Guide</h2>
            <span className="text-xs sm:text-sm text-indigo-300">
              Theoretical Foundations: Bisection, Regula Falsi, Newton–Raphson &amp; Secant
            </span>
          </div>
        </div>

        {/* 1. Bisection Method */}
        <div className="p-4 sm:p-5 bg-white/2 border border-white/10 rounded-xl mb-4">
          <h3 className="text-sm sm:text-base font-bold text-cyan-300 mb-2">
            1. The Bisection Method (Bracket-based)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2.5">
            Based on the <strong className="text-white">Intermediate Value Theorem (IVT)</strong>: If a continuous function f(x) changes sign over [a, b] such that f(a) · f(b) &lt; 0, then there exists at least one real root c in (a, b) where f(c) = 0.
          </p>
          <div className="p-2.5 bg-slate-950/70 border border-cyan-500/20 rounded-lg font-mono text-xs text-cyan-200 mb-2.5">
            Formula: c = (a + b) / 2 | Update: [a, c] if f(a)·f(c) &lt; 0 else [c, b]
          </div>
          <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
            <li><strong className="text-slate-200">Convergence Order:</strong> Linear (p = 1). Error strictly halves: |eₙ| = (b₀ - a₀) / 2ⁿ.</li>
            <li><strong className="text-slate-200">Advantage:</strong> Always guaranteed to converge under IVT condition.</li>
            <li><strong className="text-slate-200">Limitation:</strong> Slowest convergence; requires many iterations.</li>
          </ul>
        </div>

        {/* 2. Regula Falsi Method */}
        <div className="p-4 sm:p-5 bg-white/2 border border-white/10 rounded-xl mb-4">
          <h3 className="text-sm sm:text-base font-bold text-amber-300 mb-2">
            2. Regula Falsi / False Position Method (Bracket Chord-based)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2.5">
            Connects points (a, f(a)) and (b, f(b)) with a secant chord and finds where it intersects the x-axis, preserving the bracket sign change condition f(a) · f(b) &lt; 0.
          </p>
          <div className="p-2.5 bg-slate-950/70 border border-amber-500/20 rounded-lg font-mono text-xs text-amber-200 mb-2.5">
            Formula: c = [ a·f(b) - b·f(a) ] / [ f(b) - f(a) ]
          </div>
          <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
            <li><strong className="text-slate-200">Convergence Order:</strong> Linear (p = 1), but typically faster than Bisection in early steps.</li>
            <li><strong className="text-slate-200">Advantage:</strong> Safe bracketing like Bisection, but uses slope information.</li>
            <li><strong className="text-slate-200">Limitation:</strong> One boundary often remains stagnant for convex/concave curves.</li>
          </ul>
        </div>

        {/* 3. Newton-Raphson Method */}
        <div className="p-4 sm:p-5 bg-white/2 border border-white/10 rounded-xl mb-4">
          <h3 className="text-sm sm:text-base font-bold text-indigo-300 mb-2">
            3. The Newton–Raphson Method (Open Tangent-based)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2.5">
            Derived from the <strong className="text-white">Taylor Series expansion</strong> truncated after the first derivative: f(xₙ₊₁) ≈ f(xₙ) + f'(xₙ)(xₙ₊₁ - xₙ) = 0.
          </p>
          <div className="p-2.5 bg-slate-950/70 border border-indigo-500/20 rounded-lg font-mono text-xs text-indigo-200 mb-2.5">
            Iteration Formula: xₙ₊₁ = xₙ - [ f(xₙ) / f'(xₙ) ]
          </div>
          <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
            <li><strong className="text-slate-200">Convergence Order:</strong> Local Quadratic (p = 2). Correct decimal places approximately double each iteration.</li>
            <li><strong className="text-slate-200">Advantage:</strong> Ultra-fast convergence when close to a simple root.</li>
            <li><strong className="text-slate-200">Limitation:</strong> Requires computing f'(x). Fails if f'(x) ≈ 0 or diverges if x₀ is poorly chosen.</li>
          </ul>
        </div>

        {/* 4. Secant Method */}
        <div className="p-4 sm:p-5 bg-white/2 border border-white/10 rounded-xl mb-4">
          <h3 className="text-sm sm:text-base font-bold text-emerald-300 mb-2">
            4. The Secant Method (Open Chord-based)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2.5">
            Approximates the derivative f'(x) using a finite difference between two previous estimates xₙ and xₙ₋₁, avoiding the need for symbolic differentiation.
          </p>
          <div className="p-2.5 bg-slate-950/70 border border-emerald-500/20 rounded-lg font-mono text-xs text-emerald-200 mb-2.5">
            Iteration Formula: xₙ₊₁ = xₙ - f(xₙ) · [ (xₙ - xₙ₋₁) / (f(xₙ) - f(xₙ₋₁)) ]
          </div>
          <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
            <li><strong className="text-slate-200">Convergence Order:</strong> Superlinear (p = (1 + √5)/2 ≈ 1.618 - Golden Ratio).</li>
            <li><strong className="text-slate-200">Advantage:</strong> Fast convergence without computing the analytical derivative f'(x).</li>
            <li><strong className="text-slate-200">Limitation:</strong> Does not guarantee bracketing; may diverge if initial points are distant.</li>
          </ul>
        </div>

        {/* Comparison Summary Table */}
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/25 rounded-xl mb-5">
          <strong className="text-sm font-semibold text-emerald-300 block mb-2.5">
            Summary Comparison:
          </strong>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400">
                  <th className="py-2 px-3">Method</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Order (p)</th>
                  <th className="py-2 px-3">Derivative?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-2 px-3 text-cyan-300 font-semibold">Bisection</td>
                  <td className="py-2 px-3">Bracket</td>
                  <td className="py-2 px-3">1 (Linear)</td>
                  <td className="py-2 px-3">No</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-amber-300 font-semibold">Regula Falsi</td>
                  <td className="py-2 px-3">Bracket</td>
                  <td className="py-2 px-3">1 (Linear)</td>
                  <td className="py-2 px-3">No</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-indigo-300 font-semibold">Newton–Raphson</td>
                  <td className="py-2 px-3">Open</td>
                  <td className="py-2 px-3">2 (Quadratic)</td>
                  <td className="py-2 px-3">Yes (f'(x))</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-300 font-semibold">Secant</td>
                  <td className="py-2 px-3">Open</td>
                  <td className="py-2 px-3">≈ 1.618 (Superlinear)</td>
                  <td className="py-2 px-3">No (Difference)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
