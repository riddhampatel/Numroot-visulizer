import React from 'react';
import { Play, RotateCcw, Zap, ArrowRightLeft, FunctionSquare } from 'lucide-react';
import { getDerivativeEvaluator } from '../utils/numericalMethods';

const PRESETS = [
  {
    name: 'Polynomial',
    expr: 'x^3 - x - 2',
    a: '1',
    b: '2',
    x0: '1.5',
    x1: '2.0',
    desc: 'x³ - x - 2 = 0'
  },
  {
    name: 'Transcendental',
    expr: 'cos(x) - x',
    a: '0',
    b: '1',
    x0: '0.5',
    x1: '1.0',
    desc: 'cos(x) - x = 0 (Dottie Number)'
  },
  {
    name: 'Cubic Exam Problem',
    expr: 'x^3 - 4*x - 9',
    a: '2',
    b: '3',
    x0: '2.5',
    x1: '3.0',
    desc: 'x³ - 4x - 9 = 0'
  },
  {
    name: 'Exponential',
    expr: 'exp(-x) - x',
    a: '0',
    b: '1',
    x0: '0.5',
    x1: '1.0',
    desc: 'e⁻ˣ - x = 0'
  },
  {
    name: 'Square Root (√5)',
    expr: 'x^2 - 5',
    a: '2',
    b: '3',
    x0: '2.0',
    x1: '3.0',
    desc: 'x² - 5 = 0 (Calculates √5)'
  },
  {
    name: 'Kepler Orbit',
    expr: 'x - 0.2*sin(x) - 0.5',
    a: '0',
    b: '1',
    x0: '0.5',
    x1: '1.0',
    desc: 'x - 0.2·sin(x) - 0.5 = 0'
  },
  {
    name: 'Logarithmic Exam',
    expr: 'x*ln(x) - 1.2',
    a: '1',
    b: '2',
    x0: '1.5',
    x1: '2.0',
    desc: 'x·ln(x) - 1.2 = 0'
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
  x1,
  setX1,
  tolerance,
  setTolerance,
  maxIterations,
  setMaxIterations,
  onCalculate,
  onReset
}) {
  // Compute analytical derivative live for display
  const liveDeriv = React.useMemo(() => {
    try {
      const res = getDerivativeEvaluator(equation);
      return res.formulaStr;
    } catch {
      return '';
    }
  }, [equation]);

  const handleApplyPreset = (preset) => {
    setEquation(preset.expr);
    setA(preset.a);
    setB(preset.b);
    setX0(preset.x0);
    if (setX1 && preset.x1) setX1(preset.x1);
    if (onCalculate) {
      onCalculate({
        equation: preset.expr,
        a: preset.a,
        b: preset.b,
        x0: preset.x0,
        x1: preset.x1 || preset.b
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
    <div className="glass-panel p-5 sm:p-6 mb-6">
      
      {/* Top Presets Row */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            Quick Textbook &amp; Exam Presets
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click to load instant test cases
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const isSelected = equation === p.expr;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                    : 'bg-white/4 border-white/10 text-slate-300 hover:bg-white/8 hover:border-white/20'
                }`}
              >
                <Zap size={13} className={isSelected ? 'text-indigo-400' : 'text-slate-400'} />
                <span>{p.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Method Selector Tabs */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-300 mb-2.5">
          Select Numerical Method
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          
          {/* 1. Bisection */}
          <button
            type="button"
            onClick={() => handleSelectMethod('bisection')}
            className={`px-3 py-2.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              method === 'bisection'
                ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/6 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${method === 'bisection' ? 'bg-cyan-400 ring-2 ring-cyan-400/30' : 'bg-slate-600'}`} />
            <span className="truncate">Bisection (p=1)</span>
          </button>

          {/* 2. Regula Falsi */}
          <button
            type="button"
            onClick={() => handleSelectMethod('regula_falsi')}
            className={`px-3 py-2.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              method === 'regula_falsi'
                ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-md shadow-amber-500/20'
                : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/6 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${method === 'regula_falsi' ? 'bg-amber-400 ring-2 ring-amber-400/30' : 'bg-slate-600'}`} />
            <span className="truncate">Regula Falsi (Chord)</span>
          </button>

          {/* 3. Newton-Raphson */}
          <button
            type="button"
            onClick={() => handleSelectMethod('newton')}
            className={`px-3 py-2.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              method === 'newton'
                ? 'border-indigo-400 bg-indigo-500/15 text-indigo-300 shadow-md shadow-indigo-500/20'
                : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/6 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${method === 'newton' ? 'bg-indigo-400 ring-2 ring-indigo-400/30' : 'bg-slate-600'}`} />
            <span className="truncate">Newton–Raphson (p=2)</span>
          </button>

          {/* 4. Secant Method */}
          <button
            type="button"
            onClick={() => handleSelectMethod('secant')}
            className={`px-3 py-2.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              method === 'secant'
                ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-md shadow-emerald-500/20'
                : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/6 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${method === 'secant' ? 'bg-emerald-400 ring-2 ring-emerald-400/30' : 'bg-slate-600'}`} />
            <span className="truncate">Secant (p≈1.62)</span>
          </button>

          {/* 5. Compare All */}
          <button
            type="button"
            onClick={() => handleSelectMethod('compare')}
            className={`px-3 py-2.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer col-span-2 sm:col-span-1 ${
              method === 'compare'
                ? 'border-white/40 bg-white/15 text-white shadow-md shadow-white/10'
                : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/6 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft size={15} className={method === 'compare' ? 'text-white' : 'text-slate-500'} />
            <span className="truncate">Compare All 4</span>
          </button>

        </div>
      </div>

      {/* Row 1: Dedicated Full-Width Function Equation Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Mathematical Function: <span className="text-cyan-400 font-mono font-bold">f(x) = 0</span>
          </label>
          {liveDeriv && (
            <span className="text-[11px] text-indigo-300 font-mono flex items-center gap-1.5 bg-indigo-950/70 px-2.5 py-1 rounded-md border border-indigo-500/30 shadow-sm">
              <FunctionSquare size={13} className="text-indigo-400" />
              <span>f'(x) = {liveDeriv}</span>
            </span>
          )}
        </div>
        <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
          <span className="px-4 py-2.5 bg-indigo-500/10 border-r border-white/10 text-indigo-300 font-mono text-sm font-semibold select-none whitespace-nowrap">
            f(x) =
          </span>
          <input
            type="text"
            id="input-equation"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. x^3 - x - 2 or cos(x) - x"
            className="flex-1 bg-transparent border-none outline-none px-3.5 py-2.5 text-slate-100 text-sm font-mono placeholder:text-slate-500 w-full"
          />
        </div>
      </div>

      {/* Row 2: Parameters & Action Buttons (Balanced Grid: Exactly Fills Width with Zero Empty Space) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${method === 'compare' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3.5 items-end`}>
        
        {/* Method-Specific Input: Bracket [a, b] for Bisection / Regula Falsi / Compare */}
        {(method === 'bisection' || method === 'regula_falsi' || method === 'compare') && (
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${method === 'regula_falsi' ? 'text-amber-400' : 'text-cyan-400'}`}>
              Bracket [a, b] (Sign Change)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="a"
                className="input-field"
                title="Lower bound a"
              />
              <input
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="b"
                className="input-field"
                title="Upper bound b"
              />
            </div>
          </div>
        )}

        {/* Method-Specific Input: Newton Initial Guess x₀ */}
        {(method === 'newton' || method === 'compare') && (
          <div>
            <label className="block text-xs font-semibold text-indigo-400 mb-1.5">
              Newton Initial Guess x₀
            </label>
            <input
              type="number"
              step="any"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 1.5"
              className="input-field"
              title="Initial guess x₀"
            />
          </div>
        )}

        {/* Method-Specific Input: Secant Guesses [x₀, x₁] */}
        {method === 'secant' && (
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
              Secant Guesses [x₀, x₁]
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="any"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="x₀"
                className="input-field"
                title="Initial guess x₀"
              />
              <input
                type="number"
                step="any"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="x₁"
                className="input-field"
                title="Initial guess x₁"
              />
            </div>
          </div>
        )}

        {/* Tolerance (ε) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
            title="Tolerance stopping threshold"
          />
        </div>

        {/* Max Iterations */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Max Iterations
          </label>
          <input
            type="number"
            value={maxIterations}
            onChange={(e) => setMaxIterations(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="25"
            className="input-field"
            title="Maximum allowed iterations"
          />
        </div>

        {/* Action Buttons (Fills the remaining slot cleanly with 0 empty space) */}
        <div className={`flex gap-2 ${method === 'compare' ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
          <button
            type="button"
            onClick={onCalculate}
            className="flex-1 bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-500 hover:from-indigo-500 hover:via-sky-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm rounded-xl px-3.5 py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 transition-all duration-200 active:scale-95 cursor-pointer h-[42px]"
          >
            <Play size={15} className="fill-white" />
            <span className="truncate">Compute Root</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl px-3 py-2.5 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer h-[42px] shrink-0"
            title="Reset to defaults"
          >
            <RotateCcw size={15} />
          </button>
        </div>

      </div>

    </div>
  );
}
