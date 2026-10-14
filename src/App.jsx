import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import Controls from './components/Controls';
import GraphCanvas from './components/GraphCanvas';
import IterationTable from './components/IterationTable';
import ConvergenceChart from './components/ConvergenceChart';
import CSApplicationModal from './components/CSApplicationModal';
import GuideModal from './components/GuideModal';
import { runBisection, runNewtonRaphson } from './utils/numericalMethods';

export default function App() {
  const [equation, setEquation] = useState('x^3 - x - 2');
  const [method, setMethod] = useState('compare'); // 'bisection' | 'newton' | 'compare'
  const [a, setA] = useState('1');
  const [b, setB] = useState('2');
  const [x0, setX0] = useState('1.5');
  const [tolerance, setTolerance] = useState('0.00001');
  const [maxIterations, setMaxIterations] = useState('25');

  const [bisectionResult, setBisectionResult] = useState(null);
  const [newtonResult, setNewtonResult] = useState(null);
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
    const curTol = overrides.tolerance !== undefined ? overrides.tolerance : tolerance;
    const curMaxIt = overrides.maxIterations !== undefined ? overrides.maxIterations : maxIterations;
    const curMethod = overrides.method !== undefined ? overrides.method : method;

    let bRes = null;
    let nRes = null;
    const tolNum = parseFloat(curTol) || 1e-5;
    const maxIt = parseInt(curMaxIt, 10) || 25;

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

    setCurrentStepIndex(0);

    // Trigger subtle confetti celebration if any method converged
    if ((bRes && bRes.converged) || (nRes && nRes.converged)) {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#6366f1', '#06b6d4', '#10b981']
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
    setTolerance('0.00001');
    setMaxIterations('25');
    setTimeout(handleCalculate, 50);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px', minHeight: '100vh' }}>
      
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
        method={method === 'compare' ? 'newton' : method}
        bisectionResult={bisectionResult}
        newtonResult={newtonResult}
        currentStepIndex={currentStepIndex}
        setCurrentStepIndex={setCurrentStepIndex}
      />

      {/* Convergence Chart (Shown when compare or single results exist) */}
      {(bisectionResult?.success || newtonResult?.success) && (
        <ConvergenceChart
          bisectionResult={bisectionResult}
          newtonResult={newtonResult}
        />
      )}

      {/* Iteration Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: method === 'compare' ? 'repeat(auto-fit, minmax(480px, 1fr))' : '1fr', gap: '20px' }}>
        
        {(method === 'bisection' || method === 'compare') && bisectionResult && (
          <IterationTable
            result={bisectionResult}
            methodName="Bisection Method"
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
      <footer style={{
        marginTop: '36px',
        padding: '24px 0',
        borderTop: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.82rem',
        color: 'var(--text-dim)'
      }}>
        <div>
          <strong>NumRoot Visualizer</strong> • Numerical Root-Finding & Convergence Analysis
          <div style={{ marginTop: '3px' }}>
            Client-side numerical computing engine using React, Vite, and Math.js
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsGuideModalOpen(true)}
            style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            Algorithm Theory
          </button>
          <button
            onClick={() => setIsCSModalOpen(true)}
            style={{ background: 'none', border: 'none', color: '#22d3ee', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            Computing Applications
          </button>
        </div>
      </footer>

    </div>
  );
}
