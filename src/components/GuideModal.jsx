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
        maxWidth: '740px',
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
              Theoretical Foundations: Bisection vs. Newton–Raphson
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
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#22d3ee', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            1. The Bisection Method (Bracket-based)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
            Based on the <strong>Intermediate Value Theorem (IVT)</strong>: If a continuous function f(x) changes sign over [a, b] such that f(a) · f(b) &lt; 0, then there exists at least one real root c in (a, b) where f(c) = 0.
          </p>
          <div style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f1f5f9', marginBottom: '10px' }}>
            Midpoint: c = (a + b) / 2 | New Bracket: [a, c] if f(a)·f(c) &lt; 0 else [c, b]
          </div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li><strong>Convergence Rate:</strong> Guaranteed Linear (p = 1). Error is strictly bounded: |eₖ| = (b - a) / 2ᵏ.</li>
            <li><strong>Advantage:</strong> Always guaranteed to converge if the initial bracket condition is met.</li>
            <li><strong>Limitation:</strong> Relatively slow; requires many iterations for high precision.</li>
          </ul>
        </div>

        {/* 2. Newton-Raphson Method */}
        <div style={{
          padding: '16px 18px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            2. The Newton–Raphson Method (Open Tangent-based)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
            Derived from the <strong>Taylor Series expansion</strong> truncated after the first derivative: f(xₖ₊₁) ≈ f(xₖ) + f'(xₖ)(xₖ₊₁ - xₖ) = 0.
          </p>
          <div style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f1f5f9', marginBottom: '10px' }}>
            Iteration Formula: xₖ₊₁ = xₖ - [ f(xₖ) / f'(xₖ) ]
          </div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li><strong>Convergence Rate:</strong> Local quadratic (p = 2) near a simple root under suitable conditions. Correct decimal places approximately double each iteration.</li>
            <li><strong>Advantage:</strong> Rapid convergence when the initial guess is close to a simple root.</li>
            <li><strong>Limitation:</strong> Requires computing f'(x). Fails if f'(x) ≈ 0 (division by zero) or diverges if x₀ is poorly chosen.</li>
          </ul>
        </div>

        {/* Comparison Summary */}
        <div style={{
          padding: '14px 16px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '10px'
        }}>
          <strong style={{ fontSize: '0.86rem', color: '#34d399', display: 'block', marginBottom: '4px' }}>
            Key Comparative Takeaway:
          </strong>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Bisection provides <strong>unconditional robustness</strong>, while Newton-Raphson provides <strong>superior speed</strong>. In real-world computing, production solvers often combine both (e.g., Brent’s Method) to achieve both guaranteed safety and quadratic convergence.
          </p>
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
