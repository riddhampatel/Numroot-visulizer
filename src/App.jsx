import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import Controls from './components/Controls';
import GraphCanvas from './components/GraphCanvas';
import IterationTable from './components/IterationTable';
import ConvergenceChart from './components/ConvergenceChart';
import CSApplicationModal from './components/CSApplicationModal';
import GuideModal from './components/GuideModal';
import {
  runBisection,
  runRegulaFalsi,
  runNewtonRaphson,
  runSecant
} from './utils/numericalMethods';

export default function App() {
  const [equation, setEquation] = useState('x^3 - x - 2');
  const [method, setMethod] = useState('compare'); // 'bisection' | 'regula_falsi' | 'newton' | 'secant' | 'compare'
  const [a, setA] = useState('1');
  const [b, setB] = useState('2');
  const [x0, setX0] = useState('1.5');
  const [x1, setX1] = useState('2.0');
  const [tolerance, setTolerance] = useState('0.00001');
  const [maxIterations, setMaxIterations] = useState('25');

  const [bisectionResult, setBisectionResult] = useState(null);
  const [regulaFalsiResult, setRegulaFalsiResult] = useState(null);
  const [newtonResult, setNewtonResult] = useState(null);
  const [secantResult, setSecantResult] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Modals
  const [isCSModalOpen, setIsCSModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Execute calculations
  const handleCalculate = (overrides = {}) => {
    const eq = overrides.equation !== undefined ? overrides.equation : equation;
    const curA = overrides.a !== undefined ? overrides.a : a;
    const curB = overrides.b !== undefined ? overrides.b : b;
    const curX0 = overrides.x0 !== undefined ? overrides.x0 : x0;
    const curX1 = overrides.x1 !== undefined ? overrides.x1 : x1;
    const curTol = overrides.tolerance !== undefined ? overrides.tolerance : tolerance;
    const curMaxIt = overrides.maxIterations !== undefined ? overrides.maxIterations : maxIterations;
    const curMethod = overrides.method !== undefined ? overrides.method : method;

    const tolNum = parseFloat(curTol) || 1e-5;
    const maxIt = parseInt(curMaxIt, 10) || 25;

    let bRes = null;
    let rfRes = null;
    let nRes = null;
    let sRes = null;

    if (curMethod === 'bisection' || curMethod === 'compare') {
      bRes = runBisection({
        expression: eq,
        a: curA,
        b: curB,
        tolerance: tolNum,
        maxIterations: maxIt
      });
      setBisectionResult(bRes);
    } else {
      setBisectionResult(null);
    }

    if (curMethod === 'regula_falsi' || curMethod === 'compare') {
      rfRes = runRegulaFalsi({
        expression: eq,
        a: curA,
        b: curB,
        tolerance: tolNum,
        maxIterations: maxIt
      });
      setRegulaFalsiResult(rfRes);
    } else {
      setRegulaFalsiResult(null);
    }

    if (curMethod === 'newton' || curMethod === 'compare') {
      nRes = runNewtonRaphson({
        expression: eq,
        x0: curX0,
        tolerance: tolNum,
        maxIterations: maxIt
      });
      setNewtonResult(nRes);
    } else {
      setNewtonResult(null);
    }

    if (curMethod === 'secant' || curMethod === 'compare') {
      sRes = runSecant({
        expression: eq,
        x0: curMethod === 'secant' ? curX0 : curA,
        x1: curMethod === 'secant' ? curX1 : curB,
        tolerance: tolNum,
        maxIterations: maxIt
      });
      setSecantResult(sRes);
    } else {
      setSecantResult(null);
    }

    setCurrentStepIndex(0);

    // Trigger subtle confetti celebration if any method converged
    if ((bRes?.converged) || (rfRes?.converged) || (nRes?.converged) || (sRes?.converged)) {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
        });
      } catch {
        // Safe fallback
      }
    }
  };

  // Run on initial load
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setEquation('x^3 - x - 2');
    setMethod('compare');
    setA('1');
    setB('2');
    setX0('1.5');
    setX1('2.0');
    setTolerance('0.00001');
    setMaxIterations('25');
    setTimeout(() => {
      handleCalculate({
        equation: 'x^3 - x - 2',
        method: 'compare',
        a: '1',
        b: '2',
        x0: '1.5',
        x1: '2.0',
        tolerance: '0.00001',
        maxIterations: '25'
      });
    }, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen flex flex-col">
      
      {/* Top Header */}
      <Header
        onOpenCSModal={() => setIsCSModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {/* Main Grid: Controls + Visualizer */}
      <Controls
        equation={equation}
        setEquation={setEquation}
        method={method}
        setMethod={setMethod}
        a={a}
        setA={setA}
        b={b}
        setB={setB}
        x0={x0}
        setX0={setX0}
        x1={x1}
        setX1={setX1}
        tolerance={tolerance}
        setTolerance={setTolerance}
        maxIterations={maxIterations}
        setMaxIterations={setMaxIterations}
        onCalculate={handleCalculate}
        onReset={handleReset}
      />

      {/* Visual Canvas */}
      <GraphCanvas
        equation={equation}
        method={method}
        bisectionResult={bisectionResult}
        regulaFalsiResult={regulaFalsiResult}
        newtonResult={newtonResult}
        secantResult={secantResult}
        currentStepIndex={currentStepIndex}
        setCurrentStepIndex={setCurrentStepIndex}
      />

      {/* Convergence Chart (Shown when any results exist) */}
      {(bisectionResult?.success || regulaFalsiResult?.success || newtonResult?.success || secantResult?.success) && (
        <ConvergenceChart
          bisectionResult={bisectionResult}
          regulaFalsiResult={regulaFalsiResult}
          newtonResult={newtonResult}
          secantResult={secantResult}
        />
      )}

      {/* Iteration Tables */}
      <div className={`grid grid-cols-1 ${method === 'compare' ? 'xl:grid-cols-2' : ''} gap-6`}>
        
        {(method === 'bisection' || method === 'compare') && bisectionResult && (
          <IterationTable
            result={bisectionResult}
            methodName="Bisection Method"
            currentStepIndex={currentStepIndex}
            onSelectStep={(idx) => setCurrentStepIndex(idx)}
          />
        )}

        {(method === 'regula_falsi' || method === 'compare') && regulaFalsiResult && (
          <IterationTable
            result={regulaFalsiResult}
            methodName="Regula Falsi Method"
            currentStepIndex={currentStepIndex}
            onSelectStep={(idx) => setCurrentStepIndex(idx)}
          />
        )}

        {(method === 'newton' || method === 'compare') && newtonResult && (
          <IterationTable
            result={newtonResult}
            methodName="Newton–Raphson Method"
            currentStepIndex={currentStepIndex}
            onSelectStep={(idx) => setCurrentStepIndex(idx)}
          />
        )}

        {(method === 'secant' || method === 'compare') && secantResult && (
          <IterationTable
            result={secantResult}
            methodName="Secant Method"
            currentStepIndex={currentStepIndex}
            onSelectStep={(idx) => setCurrentStepIndex(idx)}
          />
        )}

      </div>

      {/* Modals */}
      <CSApplicationModal
        isOpen={isCSModalOpen}
        onClose={() => setIsCSModalOpen(false)}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto pt-8 pb-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <div className="text-slate-200 font-semibold text-sm">
            <strong>NumRoot Visualizer</strong> • Numerical Methods &amp; Root-Finding Simulator
          </div>
          <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-slate-400">
            <span>Designed &amp; Developed by <strong className="text-white">Riddham Raiyani</strong></span>
            <span>•</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono font-semibold">
              MIT License
            </span>
            <span>•</span>
            <span>Foundation of Mathematics (FM)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer text-xs font-medium"
          >
            Algorithm Theory Guide
          </button>
          <button
            onClick={() => setIsCSModalOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer text-xs font-medium"
          >
            Computing Applications
          </button>
        </div>
      </footer>

    </div>
  );
}
