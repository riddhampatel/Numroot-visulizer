import React from 'react';
import { X, Cpu, Gamepad2, Brain, Activity, Compass } from 'lucide-react';

export default function CSApplicationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const applications = [
    {
      icon: <Gamepad2 size={24} className="text-cyan-400" />,
      title: '3D Ray Tracing & Computer Graphics',
      domain: 'Game Engines & VFX (Unreal Engine / Unity / Blender)',
      desc: 'In computer graphics ray-tracing shaders, shooting a camera ray into a parametric 3D surface (such as a torus, bezier patch, or metaball) requires finding the exact intersection point where Ray(t) - Surface(t) = 0. Newton-Raphson is implemented in GPU fragment shaders to compute sub-pixel root intersections in real time.'
    },
    {
      icon: <Compass size={24} className="text-indigo-400" />,
      title: 'Physics Engines & Continuous Collision Detection (CCD)',
      domain: 'Robotics & Dynamic Simulations',
      desc: 'High-speed game objects often "tunnel" through walls if tested only at discrete timesteps. Continuous collision solvers formulate contact time as a continuous root-finding equation f(t_impact) = 0. Bisection provides a guaranteed bracket to avoid false misses, followed by Newton refinement for precision contact impulses.'
    },
    {
      icon: <Brain size={24} className="text-emerald-400" />,
      title: 'Machine Learning & Optimization (Second-Order Methods)',
      domain: 'Deep Learning & Convex Optimization',
      desc: 'Training machine learning models involves finding weights where the gradient of the loss function vanishes: ∇L(w) = 0. Newton-Raphson generalizes into Newton’s Optimization Method using the Hessian matrix of second derivatives, converging in a fraction of the steps required by standard first-order Gradient Descent.'
    },
    {
      icon: <Activity size={24} className="text-amber-400" />,
      title: 'Fast Hardware Arithmetic & Inverse Calculations',
      domain: 'Computer Architecture & Digital Signal Processing (DSP)',
      desc: 'Hardware ALUs often lack direct silicon division or square-root circuits. Instead, microcode calculates 1/D or 1/√x using 2 to 3 iterations of Newton-Raphson (such as the famous Quake Fast Inverse Square Root algorithm), replacing expensive hardware dividers with fast multiply-accumulate operations.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel bg-slate-900/95 border border-indigo-500/30 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/80">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-2 pr-8">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Cpu size={22} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Numerical Methods in Computer Science
            </h2>
            <span className="text-xs sm:text-sm text-cyan-400 font-medium">
              How Root-Finding Powers Modern Software &amp; Hardware Systems
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          In computer science, most analytical equations cannot be solved using closed-form algebra. Numerical root-finding transforms continuous mathematical theorems into discrete iterative algorithms executed on CPUs and GPUs.
        </p>

        {/* Grid of Applications */}
        <div className="space-y-3.5">
          {applications.map((app, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 bg-white/2 hover:bg-white/4 border border-white/10 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-950/50 border border-white/5 shrink-0">
                  {app.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    {app.title}
                  </h3>
                  <span className="text-xs text-indigo-300 font-medium">
                    {app.domain}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2">
                {app.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
