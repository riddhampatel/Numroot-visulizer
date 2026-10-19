import React from 'react';
import { X, BookOpen } from 'lucide-react';

export default function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '780px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        background: '#0d1322',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={22} color="#06b6d4" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Mathematical Algorithm Guide</h2>
            <span style={{ fontSize: '0.8rem', color: '#818cf8' }}>
              Theoretical Foundations: Bisection, Regula Falsi, Newton–Raphson & Secant
            </span>
          </div>
        </div>

        {/* 1. Bisection Method */}
        <div style={{
          padding: '16px 18px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#22d3ee', marginBottom: '8px' }}>
            1. The Bisection Method (Bracket-based)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
            Based on the <strong>Intermediate Value Theorem (IVT)</strong>: If a continuous function f(x) changes sign over [a, b] such that f(a) · f(b) &lt; 0, then there exists at least one real root c in (a, b) where f(c) = 0.
          </p>
          <div style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f1f5f9', marginBottom: '10px' }}>
            Formula: c = (a + b) / 2 | Update: [a, c] if f(a)·f(c) &lt; 0 else [c, b]
          </div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li><strong>Convergence Order:</strong> Linear (p = 1). Error strictly halves: |eₙ| = (b₀ - a₀) / 2ⁿ.</li>
            <li><strong>Advantage:</strong> Always guaranteed to converge under IVT condition.</li>
            <li><strong>Limitation:</strong> Slowest convergence; requires many iterations.</li>
          </ul>
        </div>

        {/* 2. Regula Falsi Method */}
        <div style={{
          padding: '16px 18px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>
            2. Regula Falsi / False Position Method (Bracket Chord-based)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
            Connects points (a, f(a)) and (b, f(b)) with a secant chord and finds where it intersects the x-axis, preserving the bracket sign change condition f(a) · f(b) &lt; 0.
          </p>
          <div style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f1f5f9', marginBottom: '10px' }}>
            Formula: c = [ a·f(b) - b·f(a) ] / [ f(b) - f(a) ]
          </div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li><strong>Convergence Order:</strong> Linear (p = 1), but typically faster than Bisection in early steps.</li>
            <li><strong>Advantage:</strong> Safe bracketing like Bisection, but uses slope information.</li>
            <li><strong>Limitation:</strong> One boundary often remains stagnant for convex/concave curves.</li>
          </ul>
        </div>

        {/* 3. Newton-Raphson Method */}
        <div style={{
          padding: '16px 18px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#818cf8', marginBottom: '8px' }}>
            3. The Newton–Raphson Method (Open Tangent-based)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
            Derived from the <strong>Taylor Series expansion</strong> truncated after the first derivative: f(xₙ₊₁) ≈ f(xₙ) + f'(xₙ)(xₙ₊₁ - xₙ) = 0.
          </p>
          <div style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f1f5f9', marginBottom: '10px' }}>
            Iteration Formula: xₙ₊₁ = xₙ - [ f(xₙ) / f'(xₙ) ]
          </div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li><strong>Convergence Order:</strong> Local Quadratic (p = 2). Correct decimal places approximately double each iteration.</li>
            <li><strong>Advantage:</strong> Ultra-fast convergence when close to a simple root.</li>
            <li><strong>Limitation:</strong> Requires computing f'(x). Fails if f'(x) ≈ 0 or diverges if x₀ is poorly chosen.</li>
          </ul>
        </div>

        {/* 4. Secant Method */}
        <div style={{
          padding: '16px 18px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
            4. The Secant Method (Open Chord-based)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
            Approximates the derivative f'(x) using a finite difference between two previous estimates xₙ and xₙ₋₁, avoiding the need for symbolic differentiation.
          </p>
          <div style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f1f5f9', marginBottom: '10px' }}>
            Iteration Formula: xₙ₊₁ = xₙ - f(xₙ) · [ (xₙ - xₙ₋₁) / (f(xₙ) - f(xₙ₋₁)) ]
          </div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li><strong>Convergence Order:</strong> Superlinear (p = (1 + √5)/2 ≈ 1.618 - Golden Ratio).</li>
            <li><strong>Advantage:</strong> Fast convergence without computing the analytical derivative f'(x).</li>
            <li><strong>Limitation:</strong> Does not guarantee bracketing; may diverge if initial points are distant.</li>
          </ul>
        </div>

        {/* Comparison Summary */}
        <div style={{
          padding: '14px 16px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '10px'
        }}>
          <strong style={{ fontSize: '0.86rem', color: '#34d399', display: 'block', marginBottom: '6px' }}>
            Summary Comparison:
          </strong>
          <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--text-muted)', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <th style={{ padding: '4px 8px' }}>Method</th>
                <th style={{ padding: '4px 8px' }}>Type</th>
                <th style={{ padding: '4px 8px' }}>Order (p)</th>
                <th style={{ padding: '4px 8px' }}>Derivative?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '4px 8px', color: '#22d3ee' }}>Bisection</td>
                <td style={{ padding: '4px 8px' }}>Bracket</td>
                <td style={{ padding: '4px 8px' }}>1 (Linear)</td>
                <td style={{ padding: '4px 8px' }}>No</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', color: '#fbbf24' }}>Regula Falsi</td>
                <td style={{ padding: '4px 8px' }}>Bracket</td>
                <td style={{ padding: '4px 8px' }}>1 (Linear)</td>
                <td style={{ padding: '4px 8px' }}>No</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', color: '#818cf8' }}>Newton–Raphson</td>
                <td style={{ padding: '4px 8px' }}>Open</td>
                <td style={{ padding: '4px 8px' }}>2 (Quadratic)</td>
                <td style={{ padding: '4px 8px' }}>Yes (f'(x))</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', color: '#34d399' }}>Secant</td>
                <td style={{ padding: '4px 8px' }}>Open</td>
                <td style={{ padding: '4px 8px' }}>≈ 1.618 (Superlinear)</td>
                <td style={{ padding: '4px 8px' }}>No (Difference)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '22px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
