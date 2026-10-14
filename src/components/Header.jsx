import React from 'react';
import { Cpu, BookOpen, Sparkles } from 'lucide-react';

export default function Header({ onOpenCSModal, onOpenGuideModal }) {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                NumRoot Visualizer
              </h1>
              <span className="badge badge-indigo">
                <Sparkles size={12} /> Numerical Methods
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Interactive Non-Linear Equation Root-Finding & Convergence Analysis in Computing
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            id="btn-algorithm-guide"
            onClick={onOpenGuideModal}
            className="btn-secondary" 
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            title="Read mathematical principles & algorithm comparison"
          >
            <BookOpen size={16} color="#06b6d4" />
            Algorithm Theory & Guide
          </button>

          <button 
            id="btn-cs-applications"
            onClick={onOpenCSModal}
            className="btn-primary" 
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            title="See where root-finding is applied in computer science"
          >
            <Cpu size={16} color="#ffffff" />
            CS Applications
          </button>
        </div>

      </div>
    </header>
  );
}
