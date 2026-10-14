import React from 'react';
import { X, Cpu, Gamepad2, Brain, Activity, Compass } from 'lucide-react';

export default function CSApplicationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const applications = [
    {
      icon: <Gamepad2 size={24} color="#38bdf8" />,
      title: '3D Ray Tracing & Computer Graphics',
      domain: 'Game Engines & VFX (Unreal Engine / Unity / Blender)',
      desc: 'In computer graphics ray-tracing shaders, shooting a camera ray into a parametric 3D surface (such as a torus, bezier patch, or metaball) requires finding the exact intersection point where Ray(t) - Surface(t) = 0. Newton-Raphson is implemented in GPU fragment shaders to compute sub-pixel root intersections in real time.'
    },
    {
      icon: <Compass size={24} color="#818cf8" />,
      title: 'Physics Engines & Continuous Collision Detection (CCD)',
      domain: 'Robotics & Dynamic Simulations',
      desc: 'High-speed game objects often "tunnel" through walls if tested only at discrete timesteps. Continuous collision solvers formulate contact time as a continuous root-finding equation f(t_impact) = 0. Bisection provides a guaranteed bracket to avoid false misses, followed by Newton refinement for precision contact impulses.'
    },
    {
      icon: <Brain size={24} color="#34d399" />,
      title: 'Machine Learning & Optimization (Second-Order Methods)',
      domain: 'Deep Learning & Convex Optimization',
      desc: 'Training machine learning models involves finding weights where the gradient of the loss function vanishes: ∇L(w) = 0. Newton-Raphson generalizes into Newton’s Optimization Method using the Hessian matrix of second derivatives, converging in a fraction of the steps required by standard first-order Gradient Descent.'
    },
    {
      icon: <Activity size={24} color="#fbbf24" />,
      title: 'Fast Hardware Arithmetic & Inverse Calculations',
      domain: 'Computer Architecture & Digital Signal Processing (DSP)',
      desc: 'Hardware ALUs often lack direct silicon division or square-root circuits. Instead, microcode calculates 1/D or 1/√x using 2 to 3 iterations of Newton-Raphson (such as the famous Quake Fast Inverse Square Root algorithm), replacing expensive hardware dividers with fast multiply-accumulate operations.'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 15, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '750px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={22} color="#818cf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Numerical Methods in Computer Science
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#22d3ee' }}>
              How Root-Finding Powers Modern Software & Hardware Systems
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
          In computer science, most analytical equations cannot be solved using closed-form algebra. Numerical root-finding transforms continuous mathematical theorems into discrete iterative algorithms executed on CPUs and GPUs.
        </p>

        {/* Grid of Applications */}
        <div style={{ display: 'grid', gap: '14px' }}>
          {applications.map((app, i) => (
            <div
              key={i}
              style={{
                padding: '16px 18px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                {app.icon}
                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {app.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>
                    {app.domain}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '8px' }}>
                {app.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '22px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
