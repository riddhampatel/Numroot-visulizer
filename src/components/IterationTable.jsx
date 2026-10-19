import React from 'react';
import { Download, Table as TableIcon, CheckCircle2, AlertTriangle, FunctionSquare } from 'lucide-react';

export default function IterationTable({
  result,
  methodName,
  currentStepIndex,
  onSelectStep
}) {
  if (!result) return null;

  const { steps = [], root, converged, iterations, error, tolerance, derivativeFormula } = result;
  const isBisection = methodName.toLowerCase().includes('bisection');
  const isRegulaFalsi = methodName.toLowerCase().includes('regula');
  const isNewton = methodName.toLowerCase().includes('newton');
  const isSecant = methodName.toLowerCase().includes('secant');

  const handleExportCSV = () => {
    if (!steps.length) return;

    let headers = [];
    let rows = [];

    if (isBisection || isRegulaFalsi) {
      headers = ['Iteration (n)', 'a_n', 'b_n', 'c_n', 'f(a_n)', 'f(b_n)', 'f(c_n)', 'Abs Error', 'Rel Error (%)'];
      rows = steps.map((s) => [
        s.iteration,
        s.a.toFixed(8),
        s.b.toFixed(8),
        s.c.toFixed(8),
        s.fa.toExponential(4),
        s.fb.toExponential(4),
        s.fc.toExponential(4),
        s.error.toExponential(6),
        s.relativeError !== null && s.relativeError !== undefined ? s.relativeError.toFixed(4) : 'N/A'
      ]);
    } else if (isNewton) {
      headers = ['Iteration (n)', 'x_n', 'f(x_n)', "f'(x_n)", 'x_{n+1}', 'Abs Error', 'Rel Error (%)'];
      rows = steps.map((s) => [
        s.iteration,
        s.xk.toFixed(8),
        s.fxk.toExponential(4),
        s.dfxk.toExponential(4),
        s.xNext.toFixed(8),
        s.error.toExponential(6),
        s.relativeError !== null && s.relativeError !== undefined ? s.relativeError.toFixed(4) : 'N/A'
      ]);
    } else if (isSecant) {
      headers = ['Iteration (n)', 'x_{n-1}', 'x_n', 'f(x_{n-1})', 'f(x_n)', 'x_{n+1}', 'Abs Error', 'Rel Error (%)'];
      rows = steps.map((s) => [
        s.iteration,
        s.xPrev.toFixed(8),
        s.xCurr.toFixed(8),
        s.fPrev.toExponential(4),
        s.fCurr.toExponential(4),
        s.xNext.toFixed(8),
        s.error.toExponential(6),
        s.relativeError !== null && s.relativeError !== undefined ? s.relativeError.toFixed(4) : 'N/A'
      ]);
    }

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${methodName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_iterations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      
      {/* Table Header & Metrics */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TableIcon size={18} color="#818cf8" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            {methodName} Iteration Table
          </h3>
          {converged ? (
            <span className="badge badge-emerald">
              <CheckCircle2 size={12} /> Converged in {iterations} steps
            </span>
          ) : (
            <span className="badge badge-amber">
              <AlertTriangle size={12} /> {error ? 'Halted' : 'Max iterations reached'}
            </span>
          )}
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!steps.length}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          title="Download iteration history as CSV file"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Derivative Formula Display (For Newton-Raphson) */}
      {derivativeFormula && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '8px',
          marginBottom: '14px',
          fontSize: '0.82rem',
          color: '#c7d2fe'
        }}>
          <FunctionSquare size={16} color="#818cf8" />
          <span>Analytical Derivative:</span>
          <code style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#a5b4fc',
            background: 'rgba(0,0,0,0.25)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            f'(x) = {derivativeFormula}
          </code>
        </div>
      )}

      {/* Metrics Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '16px',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '10px',
        border: '1px solid var(--border-glass)'
      }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Computed Root</span>
          <strong style={{ fontSize: '1.1rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            {root !== undefined && root !== null && !isNaN(root) ? root.toFixed(7) : 'N/A'}
          </strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Iterations</span>
          <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {iterations ?? steps.length}
          </strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Tolerance (ε)</span>
          <strong style={{ fontSize: '1.1rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
            {tolerance ? tolerance.toExponential(1) : '1.0e-5'}
          </strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Final Residual |f(root)|</span>
          <strong style={{ fontSize: '1.1rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
            {result.finalResidual !== undefined && !isNaN(result.finalResidual)
              ? result.finalResidual.toExponential(4)
              : (steps.length > 0
                  ? Math.abs(steps[steps.length - 1].fc ?? steps[steps.length - 1].fxNext ?? steps[steps.length - 1].fxk ?? 0).toExponential(4)
                  : 'N/A')}
          </strong>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '8px',
          color: '#fb7185',
          fontSize: '0.85rem',
          marginBottom: '16px'
        }}>
          <strong>Algorithm Notice:</strong> {error}
        </div>
      )}

      {/* Responsive Table Scroll Container */}
      <div style={{ overflowX: 'auto', maxHeight: '360px', overflowY: 'auto', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0e1422', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid var(--border-glass)' }}>
              <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>n</th>
              
              {isBisection && (
                <>
                  <th style={{ padding: '10px 14px', color: '#22d3ee' }}>aₙ (Lower)</th>
                  <th style={{ padding: '10px 14px', color: '#22d3ee' }}>bₙ (Upper)</th>
                  <th style={{ padding: '10px 14px', color: '#fbbf24' }}>cₙ (Midpoint)</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>f(aₙ)</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>f(bₙ)</th>
                  <th style={{ padding: '10px 14px', color: '#fbbf24' }}>f(cₙ)</th>
                </>
              )}

              {isRegulaFalsi && (
                <>
                  <th style={{ padding: '10px 14px', color: '#f59e0b' }}>aₙ</th>
                  <th style={{ padding: '10px 14px', color: '#f59e0b' }}>bₙ</th>
                  <th style={{ padding: '10px 14px', color: '#38bdf8' }}>cₙ (Chord Root)</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>f(aₙ)</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>f(bₙ)</th>
                  <th style={{ padding: '10px 14px', color: '#38bdf8' }}>f(cₙ)</th>
                </>
              )}

              {isNewton && (
                <>
                  <th style={{ padding: '10px 14px', color: '#818cf8' }}>xₙ (Current)</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>f(xₙ)</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>f'(xₙ)</th>
                  <th style={{ padding: '10px 14px', color: '#34d399' }}>xₙ₊₁ (Next)</th>
                </>
              )}

              {isSecant && (
                <>
                  <th style={{ padding: '10px 14px', color: '#10b981' }}>xₙ₋₁</th>
                  <th style={{ padding: '10px 14px', color: '#10b981' }}>xₙ</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>f(xₙ₋₁)</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>f(xₙ)</th>
                  <th style={{ padding: '10px 14px', color: '#34d399' }}>xₙ₊₁</th>
                </>
              )}

              <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Abs Error</th>
              <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Rel Error %</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              return (
                <tr
                  key={step.iteration}
                  onClick={() => onSelectStep && onSelectStep(idx)}
                  style={{
                    background: isActive ? 'rgba(99, 102, 241, 0.18)' : (idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'),
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'; }}
                >
                  <td style={{ padding: '8px 14px', color: isActive ? '#818cf8' : 'var(--text-dim)', fontWeight: 600 }}>
                    {step.iteration}
                  </td>

                  {isBisection && (
                    <>
                      <td style={{ padding: '8px 14px', color: 'var(--text-main)' }}>{step.a.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-main)' }}>{step.b.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: '#fbbf24', fontWeight: 600 }}>{step.c.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.fa.toExponential(3)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.fb.toExponential(3)}</td>
                      <td style={{ padding: '8px 14px', color: '#fbbf24' }}>{step.fc.toExponential(3)}</td>
                    </>
                  )}

                  {isRegulaFalsi && (
                    <>
                      <td style={{ padding: '8px 14px', color: 'var(--text-main)' }}>{step.a.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-main)' }}>{step.b.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: '#38bdf8', fontWeight: 600 }}>{step.c.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.fa.toExponential(3)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.fb.toExponential(3)}</td>
                      <td style={{ padding: '8px 14px', color: '#38bdf8' }}>{step.fc.toExponential(3)}</td>
                    </>
                  )}

                  {isNewton && (
                    <>
                      <td style={{ padding: '8px 14px', color: 'var(--text-main)' }}>{step.xk.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.fxk.toExponential(3)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.dfxk.toExponential(3)}</td>
                      <td style={{ padding: '8px 14px', color: '#34d399', fontWeight: 600 }}>{step.xNext.toFixed(6)}</td>
                    </>
                  )}

                  {isSecant && (
                    <>
                      <td style={{ padding: '8px 14px', color: 'var(--text-main)' }}>{step.xPrev.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-main)' }}>{step.xCurr.toFixed(6)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.fPrev.toExponential(3)}</td>
                      <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.fCurr.toExponential(3)}</td>
                      <td style={{ padding: '8px 14px', color: '#34d399', fontWeight: 600 }}>{step.xNext.toFixed(6)}</td>
                    </>
                  )}

                  <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>{step.error.toExponential(3)}</td>
                  <td style={{ padding: '8px 14px', color: 'var(--text-dim)' }}>
                    {step.relativeError !== null && step.relativeError !== undefined
                      ? `${step.relativeError.toFixed(3)}%`
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
