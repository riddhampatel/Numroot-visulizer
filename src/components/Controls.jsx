import React from 'react';
import { Play, RotateCcw, Zap, ArrowRightLeft } from 'lucide-react';

const PRESETS = [
  {
    name: 'Polynomial',
    expr: 'x^3 - x - 2',
    a: '1',
    b: '2',
    x0: '1.5',
    desc: 'x³ - x - 2 = 0'
  },
  {
    name: 'Transcendental',
    expr: 'cos(x) - x',
    a: '0',
    b: '1',
    x0: '0.5',
    desc: 'cos(x) - x = 0 (Dottie Number)'
  },
  {
    name: 'Cubic Exam Problem',
    expr: 'x^3 - 4*x - 9',
    a: '2',
    b: '3',
    x0: '2.5',
    desc: 'x³ - 4x - 9 = 0'
  },
  {
    name: 'Exponential',
    expr: 'exp(-x) - x',
    a: '0',
    b: '1',
    x0: '0.5',
    desc: 'e⁻ˣ - x = 0'
  },
  {
    name: 'Square Root (√5)',
    expr: 'x^2 - 5',
    a: '2',
    b: '3',
    x0: '2.0',
    desc: 'x² - 5 = 0 (Calculates √5)'
  }
];

export default function Controls({
  equation,
  setEquation,
  method,
  setMethod,
  a,
  setA,
  b,
  setB,
  x0,
  setX0,
  tolerance,
  setTolerance,
  maxIterations,
  setMaxIterations,
  onCalculate,
  onReset
}) {
  const handleApplyPreset = (preset) => {
    setEquation(preset.expr);
    setA(preset.a);
    setB(preset.b);
    setX0(preset.x0);
    if (onCalculate) {
      onCalculate({
        equation: preset.expr,
        a: preset.a,
        b: preset.b,
        x0: preset.x0
      });
    }
  };

  const handleSelectMethod = (newMethod) => {
    setMethod(newMethod);
    if (onCalculate) {
      onCalculate({ method: newMethod });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onCalculate) {
      onCalculate();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
      
      {/* Top Presets Row */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700 }}>
            Quick Textbook & Exam Presets
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Click to load instant test cases
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="btn-secondary"
              style={{
                fontSize: '0.78rem',
                padding: '6px 12px',
                borderRadius: '8px',
                background: equation === p.expr ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: equation === p.expr ? 'var(--accent-indigo)' : 'var(--border-glass)'
              }}
            >
              <Zap size={12} color={equation === p.expr ? '#818cf8' : '#94a3b8'} />
              <span>{p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Method Selector Tabs */}
      <div style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
          Select Calculation Mode
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          
          <button
            type="button"
            onClick={() => handleSelectMethod('bisection')}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: method === 'bisection' ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
              background: method === 'bisection' ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              color: method === 'bisection' ? '#22d3ee' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: method === 'bisection' ? '#06b6d4' : '#64748b' }} />
            Bisection Method
          </button>

          <button
            type="button"
            onClick={() => handleSelectMethod('newton')}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: method === 'newton' ? '1px solid #818cf8' : '1px solid var(--border-glass)',
              background: method === 'newton' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              color: method === 'newton' ? '#818cf8' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: method === 'newton' ? '#818cf8' : '#64748b' }} />
            Newton–Raphson
          </button>

          <button
            type="button"
            onClick={() => handleSelectMethod('compare')}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: method === 'compare' ? '1px solid #10b981' : '1px solid var(--border-glass)',
              background: method === 'compare' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              color: method === 'compare' ? '#34d399' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowRightLeft size={16} color={method === 'compare' ? '#34d399' : '#64748b'} />
            Dual Comparison (Both)
          </button>

        </div>
      </div>

      {/* Input Parameters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
        
        {/* Equation Input */}
        <div style={{ gridColumn: 'span 2', minWidth: '280px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Mathematical Function: <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>f(x) = 0</span>
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 21, 34, 0.9)',
            border: '1px solid var(--border-glass)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
          }}>
            <span style={{
              padding: '10px 14px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRight: '1px solid var(--border-glass)',
              color: '#818cf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              fontWeight: 600,
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              f(x) =
            </span>
            <input
              type="text"
              id="input-equation"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. x^3 - x - 2 or cos(x) - x"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '10px 14px',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-mono)',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Bisection Bounds (if bisection or compare) */}
        {(method === 'bisection' || method === 'compare') && (
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#22d3ee', marginBottom: '6px' }}>
              Bracket Interval [a, b]
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="a (lower)"
                className="input-field"
                title="Lower bound a"
              />
              <input
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="b (upper)"
                className="input-field"
                title="Upper bound b"
              />
            </div>
          </div>
        )}

        {/* Newton Initial Guess (if newton or compare) */}
        {(method === 'newton' || method === 'compare') && (
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#818cf8', marginBottom: '6px' }}>
              Initial Guess x₀
            </label>
            <input
              type="number"
              step="any"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 1.5"
              className="input-field"
            />
          </div>
        )}

        {/* Tolerance */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Tolerance (ε)
          </label>
          <input
            type="number"
            step="any"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0.00001"
            className="input-field"
          />
        </div>

        {/* Max Iterations */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Max Iterations
          </label>
          <input
            type="number"
            value={maxIterations}
            onChange={(e) => setMaxIterations(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="25"
            className="input-field"
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={onCalculate}
            className="btn-primary"
            style={{ flex: 1, padding: '10px 18px' }}
          >
            <Play size={16} />
            Compute Root
          </button>

          <button
            type="button"
            onClick={onReset}
            className="btn-secondary"
            title="Reset to defaults"
            style={{ padding: '10px 14px' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
