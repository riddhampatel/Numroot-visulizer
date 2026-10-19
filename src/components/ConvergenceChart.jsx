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
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Scale size={18} color="#10b981" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            Error Convergence Rate Analysis (Logarithmic Error Decay)
          </h3>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          {bSteps.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', background: '#06b6d4', borderRadius: '2px' }} />
              <span style={{ color: '#22d3ee' }}>Bisection (p=1)</span>
            </div>
          )}
          {rfSteps.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', background: '#f59e0b', borderRadius: '2px' }} />
              <span style={{ color: '#fbbf24' }}>Regula Falsi (p=1)</span>
            </div>
          )}
          {nSteps.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', background: '#818cf8', borderRadius: '2px' }} />
              <span style={{ color: '#818cf8' }}>Newton–Raphson (p=2)</span>
            </div>
          )}
          {sSteps.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', background: '#10b981', borderRadius: '2px' }} />
              <span style={{ color: '#34d399' }}>Secant (p≈1.62)</span>
            </div>
          )}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        
        {/* Bisection Card */}
        {bSteps.length > 0 && (
          <div style={{ padding: '14px 16px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ color: '#22d3ee', fontSize: '0.9rem' }}>Bisection Method</strong>
              <span className="badge badge-cyan">Linear (p = 1)</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              • Unconditional convergence if <code className="math-mono">f(a)·f(b) &lt; 0</code>.<br />
              • Midpoint: <code className="math-mono">c = (a + b) / 2</code>.<br />
              • Took <strong>{bSteps.length} iterations</strong>.
            </p>
          </div>
        )}

        {/* Regula Falsi Card */}
        {rfSteps.length > 0 && (
          <div style={{ padding: '14px 16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ color: '#fbbf24', fontSize: '0.9rem' }}>Regula Falsi</strong>
              <span className="badge badge-amber">Linear (Chord)</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              • Retains bracketing safety while using chord slope.<br />
              • Formula: <code className="math-mono">c = (a·fb - b·fa)/(fb - fa)</code>.<br />
              • Took <strong>{rfSteps.length} iterations</strong>.
            </p>
          </div>
        )}

        {/* Newton Card */}
        {nSteps.length > 0 && (
          <div style={{ padding: '14px 16px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ color: '#818cf8', fontSize: '0.9rem' }}>Newton–Raphson</strong>
              <span className="badge badge-indigo">Quadratic (p = 2)</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              • Rapid quadratic convergence using exact derivative <code className="math-mono">f'(x)</code>.<br />
              • Formula: <code className="math-mono">xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)</code>.<br />
              • Took <strong>{nSteps.length} iterations</strong>.
            </p>
          </div>
        )}

        {/* Secant Card */}
        {sSteps.length > 0 && (
          <div style={{ padding: '14px 16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Secant Method</strong>
              <span className="badge badge-emerald">Superlinear (p ≈ 1.62)</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              • Approximates derivative without symbolic differentiation.<br />
              • Formula: <code className="math-mono">xₙ₊₁ = xₙ - f(xₙ)·(xₙ - xₙ₋₁)/(f(xₙ) - f(xₙ₋₁))</code>.<br />
              • Took <strong>{sSteps.length} iterations</strong>.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
