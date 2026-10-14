import React, { useRef, useEffect } from 'react';
import { Scale } from 'lucide-react';

export default function ConvergenceChart({ bisectionResult, newtonResult }) {
  const canvasRef = useRef(null);

  const bSteps = bisectionResult?.steps || [];
  const nSteps = newtonResult?.steps || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    if (bSteps.length === 0 && nSteps.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '13px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Run comparison to view logarithmic error decay curves', width / 2, height / 2);
      return;
    }

    const padding = { top: 30, right: 40, bottom: 40, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Determine max iterations and error ranges in log10 scale
    const maxIter = Math.max(bSteps.length, nSteps.length, 5);

    // Errors in log10: e.g. 10^-1 -> -1, 10^-12 -> -12
    const minLog = -14;
    const maxLog = 1;

    const toX = (iter) => padding.left + ((iter - 1) / (maxIter - 1)) * chartW;
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
    ctx.fillText('Iterations (k)', padding.left + chartW / 2, height - 10);

    // Draw Bisection Line (Cyan)
    if (bSteps.length > 0) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      bSteps.forEach((s, idx) => {
        const logErr = Math.max(minLog, Math.log10(Math.max(s.error, 1e-15)));
        const px = toX(s.iteration);
        const py = toY(logErr);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Points
      ctx.fillStyle = '#22d3ee';
      bSteps.forEach((s) => {
        const logErr = Math.max(minLog, Math.log10(Math.max(s.error, 1e-15)));
        ctx.beginPath();
        ctx.arc(toX(s.iteration), toY(logErr), 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw Newton-Raphson Line (Indigo/Violet)
    if (nSteps.length > 0) {
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      nSteps.forEach((s, idx) => {
        const logErr = Math.max(minLog, Math.log10(Math.max(s.error, 1e-15)));
        const px = toX(s.iteration);
        const py = toY(logErr);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Points
      ctx.fillStyle = '#a5b4fc';
      nSteps.forEach((s) => {
        const logErr = Math.max(minLog, Math.log10(Math.max(s.error, 1e-15)));
        ctx.beginPath();
        ctx.arc(toX(s.iteration), toY(logErr), 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

  }, [bisectionResult, newtonResult]);

  const bIter = bSteps.length;
  const nIter = nSteps.length;

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Scale size={18} color="#10b981" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            Error Convergence Rate Analysis
          </h3>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#06b6d4', borderRadius: '2px' }} />
            <span style={{ color: '#22d3ee' }}>Bisection (Linear: O(1/2ᵏ))</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#818cf8', borderRadius: '2px' }} />
            <span style={{ color: '#818cf8' }}>Newton-Raphson (Quadratic: O(e²))</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
        <canvas
          ref={canvasRef}
          width={860}
          height={260}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Comparative Analysis Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        
        {/* Bisection Card */}
        <div style={{
          padding: '14px 18px',
          background: 'rgba(6, 182, 212, 0.05)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#22d3ee', fontSize: '0.92rem' }}>Bisection Method</strong>
            <span className="badge badge-cyan">Guaranteed Linear (p = 1)</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            • Guaranteed convergence when bracketing conditions hold (<code className="math-mono">f(a)·f(b) &lt; 0</code>).
            <br />
            • Error interval strictly halves each step: <code className="math-mono">|bₖ - aₖ| = |b₀ - a₀| / 2ᵏ</code>.
            <br />
            • Actual iterations: <strong>{bIter || '–'} steps</strong> to reach tolerance.
          </p>
        </div>

        {/* Newton Card */}
        <div style={{
          padding: '14px 18px',
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#818cf8', fontSize: '0.92rem' }}>Newton–Raphson Method</strong>
            <span className="badge badge-indigo">Local Quadratic (p = 2)</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            • Local quadratic convergence near a simple root under suitable conditions: <code className="math-mono">|eₙ₊₁| ≈ C·|eₙ|²</code>.
            <br />
            • Convergence rate depends on the chosen initial guess <code className="math-mono">x₀</code> and function behavior.
            <br />
            • Actual iterations: <strong>{nIter || '–'} steps</strong> {bIter > 0 && nIter > 0 ? `(${bIter > nIter ? `${(bIter / nIter).toFixed(1)}x fewer iterations than Bisection` : 'for current initial guess'})` : ''}.
          </p>
        </div>

      </div>

    </div>
  );
}
