import React, { useRef, useEffect } from 'react';
import { Scale } from 'lucide-react';

export default function ConvergenceChart({
  bisectionResult,
  regulaFalsiResult,
  newtonResult,
  secantResult
}) {
  const canvasRef = useRef(null);

  const bSteps = bisectionResult?.steps || [];
  const rfSteps = regulaFalsiResult?.steps || [];
  const nSteps = newtonResult?.steps || [];
  const sSteps = secantResult?.steps || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const b = bisectionResult?.steps || [];
    const rf = regulaFalsiResult?.steps || [];
    const n = newtonResult?.steps || [];
    const s = secantResult?.steps || [];

    // Clear
    ctx.fillStyle = '#080c15';
    ctx.fillRect(0, 0, width, height);

    if (b.length === 0 && rf.length === 0 && n.length === 0 && s.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '13px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Run calculation to view logarithmic error decay curves', width / 2, height / 2);
      return;
    }

    const padding = { top: 30, right: 40, bottom: 40, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxIter = Math.max(b.length, rf.length, n.length, s.length, 5);

    const minLog = -14;
    const maxLog = 1;

    const toX = (iter) => padding.left + ((iter - 1) / Math.max(maxIter - 1, 1)) * chartW;
    const toY = (logVal) => padding.top + ((maxLog - logVal) / (maxLog - minLog)) * chartH;

    // Draw Grid Lines (log scale)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';

    for (let logVal = maxLog; logVal >= minLog; logVal -= 2) {
      const y = toY(logVal);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(`10^${logVal}`, padding.left - 8, y + 3);
    }

    // X Axis ticks (Iterations)
    ctx.textAlign = 'center';
    for (let iter = 1; iter <= maxIter; iter += Math.max(1, Math.floor(maxIter / 8))) {
      const x = toX(iter);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      ctx.fillText(`k=${iter}`, x, height - padding.bottom + 18);
    }

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Iterations (n)', padding.left + chartW / 2, height - 10);

    // Helper to draw series
    const drawSeries = (steps, strokeColor, fillColor) => {
      if (!steps || steps.length === 0) return;

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      steps.forEach((s, idx) => {
        const logErr = Math.max(minLog, Math.log10(Math.max(s.error, 1e-15)));
        const px = toX(s.iteration);
        const py = toY(logErr);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.fillStyle = fillColor;
      steps.forEach((s) => {
        const logErr = Math.max(minLog, Math.log10(Math.max(s.error, 1e-15)));
        ctx.beginPath();
        ctx.arc(toX(s.iteration), toY(logErr), 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // 1. Bisection (Cyan)
    drawSeries(b, '#06b6d4', '#22d3ee');

    // 2. Regula Falsi (Amber)
    drawSeries(rf, '#f59e0b', '#fbbf24');

    // 3. Newton-Raphson (Indigo)
    drawSeries(n, '#818cf8', '#a5b4fc');

    // 4. Secant (Emerald)
    drawSeries(s, '#10b981', '#34d399');

  }, [bisectionResult, regulaFalsiResult, newtonResult, secantResult]);

  return (
    <div className="glass-panel p-4 sm:p-5 md:p-6 mb-6">
      
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Scale size={18} className="text-emerald-400 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            Error Convergence Rate Analysis (Logarithmic Error Decay)
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 flex-wrap text-xs">
          {bSteps.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 rounded" />
              <span className="text-cyan-300 font-medium">Bisection (p=1)</span>
            </div>
          )}
          {rfSteps.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-400 rounded" />
              <span className="text-amber-300 font-medium">Regula Falsi (p=1)</span>
            </div>
          )}
          {nSteps.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-indigo-400 rounded" />
              <span className="text-indigo-300 font-medium">Newton–Raphson (p=2)</span>
            </div>
          )}
          {sSteps.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-400 rounded" />
              <span className="text-emerald-300 font-medium">Secant (p≈1.62)</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full overflow-hidden rounded-xl border border-white/10 mb-4 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={860}
          height={260}
          className="w-full h-auto block"
        />
      </div>

      {/* Comparative Analysis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Bisection Card */}
        {bSteps.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-cyan-950/20 border border-cyan-500/25 rounded-xl hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <strong className="text-cyan-300 text-sm">Bisection Method</strong>
              <span className="badge badge-cyan">Linear (p = 1)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              <span>• Unconditional convergence if <code className="math-mono text-cyan-300">f(a)·f(b) &lt; 0</code>.</span><br />
              <span>• Midpoint: <code className="math-mono text-cyan-300">c = (a + b) / 2</code>.</span><br />
              <span>• Converged in <strong className="text-white">{bSteps.length} iterations</strong>.</span>
            </p>
          </div>
        )}

        {/* Regula Falsi Card */}
        {rfSteps.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-amber-950/20 border border-amber-500/25 rounded-xl hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <strong className="text-amber-300 text-sm">Regula Falsi</strong>
              <span className="badge badge-amber">Linear (Chord)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              <span>• Retains bracketing safety while using chord slope.</span><br />
              <span>• Formula: <code className="math-mono text-amber-300">c = (a·fb - b·fa)/(fb - fa)</code>.</span><br />
              <span>• Converged in <strong className="text-white">{rfSteps.length} iterations</strong>.</span>
            </p>
          </div>
        )}

        {/* Newton Card */}
        {nSteps.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-indigo-950/20 border border-indigo-500/25 rounded-xl hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <strong className="text-indigo-300 text-sm">Newton–Raphson</strong>
              <span className="badge badge-indigo">Quadratic (p = 2)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              <span>• Rapid quadratic convergence using exact derivative <code className="math-mono text-indigo-300">f'(x)</code>.</span><br />
              <span>• Formula: <code className="math-mono text-indigo-300">xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)</code>.</span><br />
              <span>• Converged in <strong className="text-white">{nSteps.length} iterations</strong>.</span>
            </p>
          </div>
        )}

        {/* Secant Card */}
        {sSteps.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-emerald-950/20 border border-emerald-500/25 rounded-xl hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <strong className="text-emerald-300 text-sm">Secant Method</strong>
              <span className="badge badge-emerald">Superlinear (p ≈ 1.62)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              <span>• Approximates derivative without symbolic differentiation.</span><br />
              <span>• Formula: <code className="math-mono text-emerald-300">xₙ₊₁ = xₙ - f(xₙ)·Δx/Δf</code>.</span><br />
              <span>• Converged in <strong className="text-white">{sSteps.length} iterations</strong>.</span>
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
