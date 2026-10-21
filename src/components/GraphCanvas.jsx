import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { compileExpression, evaluateAt } from '../utils/numericalMethods';

export default function GraphCanvas({
  equation,
  method,
  bisectionResult,
  regulaFalsiResult,
  newtonResult,
  secantResult,
  currentStepIndex,
  setCurrentStepIndex
}) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewWindow, setViewWindow] = useState({ xMin: -1, xMax: 4, yMin: -6, yMax: 10 });
  const [compareVisualMethod, setCompareVisualMethod] = useState('newton');
  const activeVisualMethod = method !== 'compare' ? method : compareVisualMethod;

  // Determine active result based on activeVisualMethod
  let activeResult = null;
  if (activeVisualMethod === 'bisection') activeResult = bisectionResult;
  else if (activeVisualMethod === 'regula_falsi') activeResult = regulaFalsiResult;
  else if (activeVisualMethod === 'secant') activeResult = secantResult;
  else activeResult = newtonResult;

  const activeSteps = activeResult?.steps || [];
  const totalSteps = activeSteps.length;
  const currentStep = activeSteps[currentStepIndex] || null;
  const calculatedRoot = activeResult?.root;

  // Auto adjust viewport when active result root or steps change
  const rootStr = activeResult?.root !== undefined ? String(activeResult.root) : '';
  const firstStepA = activeSteps[0]?.a ?? activeSteps[0]?.xk ?? activeSteps[0]?.xPrev ?? '';
  useEffect(() => {
    if (!activeResult?.success || activeSteps.length === 0) return;

    const focusPoints = [];
    const s0 = activeSteps[0];
    if (s0.a !== undefined) focusPoints.push(s0.a, s0.b);
    if (s0.xk !== undefined) focusPoints.push(s0.xk);
    if (s0.xPrev !== undefined) focusPoints.push(s0.xPrev, s0.xCurr);
    if (activeResult.root !== undefined && activeResult.root !== null && !isNaN(activeResult.root)) {
      focusPoints.push(activeResult.root);
    }

    if (focusPoints.length > 0) {
      const minX = Math.min(...focusPoints);
      const maxX = Math.max(...focusPoints);
      const padding = Math.max(Math.abs(maxX - minX) * 0.8, 1.5);
      setViewWindow((prev) => ({
        ...prev,
        xMin: minX - padding,
        xMax: maxX + padding,
        yMin: -8,
        yMax: 8
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootStr, firstStepA, activeVisualMethod]);

  // Step Playback Interval
  useEffect(() => {
    let interval = null;
    if (isPlaying && totalSteps > 0) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, setCurrentStepIndex]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const { xMin, xMax, yMin, yMax } = viewWindow;

    // Coordinate mapping helpers
    const toPxX = (x) => ((x - xMin) / (xMax - xMin)) * width;
    const toPxY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;

    // 1. Clear background
    ctx.fillStyle = '#080c15';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Subtle Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Grid X ticks
    const xRange = xMax - xMin;
    const xStep = Math.pow(10, Math.floor(Math.log10(Math.max(xRange, 0.1)))) / (xRange > 15 ? 1 : 2);
    const firstX = Math.floor(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      const px = toPxX(x);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      if (Math.abs(x) > 1e-6) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(x.toFixed(1), px + 3, toPxY(0) + 12);
      }
    }

    // Grid Y ticks
    const yRange = yMax - yMin;
    const yStep = Math.pow(10, Math.floor(Math.log10(Math.max(yRange, 0.1)))) / (yRange > 15 ? 1 : 2);
    const firstY = Math.floor(yMin / yStep) * yStep;
    for (let y = firstY; y <= yMax; y += yStep) {
      const py = toPxY(y);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (Math.abs(y) > 1e-6) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(y.toFixed(1), toPxX(0) + 4, py - 3);
      }
    }

    // 3. Draw Main Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;

    // X Axis (y = 0)
    const y0 = toPxY(0);
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(width, y0);
    ctx.stroke();

    // Y Axis (x = 0)
    const x0 = toPxX(0);
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, height);
    ctx.stroke();

    // 4. Plot Mathematical Curve f(x)
    const { compiled } = compileExpression(equation);
    if (compiled) {
      ctx.strokeStyle = '#38bdf8'; // Sky blue curve
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      let isDrawing = false;
      const numSamples = width;
      for (let px = 0; px <= numSamples; px++) {
        const x = xMin + (px / numSamples) * (xMax - xMin);
        const y = evaluateAt(compiled, x);

        if (!isNaN(y) && isFinite(y) && y >= yMin - 50 && y <= yMax + 50) {
          const py = toPxY(y);
          if (!isDrawing) {
            ctx.moveTo(px, py);
            isDrawing = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          isDrawing = false;
        }
      }
      ctx.stroke();
    }

    // 5. Draw Step Visualizations
    if (currentStep) {
      // (A) Bisection Visualization
      if (activeVisualMethod === 'bisection' && currentStep.a !== undefined) {
        const pxA = toPxX(currentStep.a);
        const pxB = toPxX(currentStep.b);
        const pxC = toPxX(currentStep.c);

        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.fillRect(pxA, 0, pxB - pxA, height);

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;

        // Line a & b
        ctx.beginPath();
        ctx.moveTo(pxA, 0);
        ctx.lineTo(pxA, height);
        ctx.moveTo(pxB, 0);
        ctx.lineTo(pxB, height);
        ctx.stroke();

        // Midpoint c
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(pxC, 0);
        ctx.lineTo(pxC, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Points
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pxC, toPxY(currentStep.fc), 5.5, 0, Math.PI * 2);
        ctx.arc(pxC, toPxY(0), 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#22d3ee';
        ctx.fillText(`aₙ: ${currentStep.a.toFixed(3)}`, pxA + 4, 25);
        ctx.fillText(`bₙ: ${currentStep.b.toFixed(3)}`, pxB - 65, 25);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`mid cₙ: ${currentStep.c.toFixed(4)}`, pxC + 5, 45);
      }

      // (B) Regula Falsi Visualization (Chord between (a, f(a)) and (b, f(b)))
      if (activeVisualMethod === 'regula_falsi' && currentStep.a !== undefined) {
        const pxA = toPxX(currentStep.a);
        const pyA = toPxY(currentStep.fa);
        const pxB = toPxX(currentStep.b);
        const pyB = toPxY(currentStep.fb);
        const pxC = toPxX(currentStep.c);
        const pyAxis = toPxY(0);

        // Draw secant chord line connecting (a, f(a)) and (b, f(b))
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pxA, pyA);
        ctx.lineTo(pxB, pyB);
        ctx.stroke();

        // Vertical drop to (c, 0)
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.beginPath();
        ctx.moveTo(pxC, pyAxis);
        ctx.lineTo(pxC, toPxY(currentStep.fc));
        ctx.stroke();
        ctx.setLineDash([]);

        // Points at (a, f(a)), (b, f(b)), and (c, 0)
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(pxA, pyA, 5.5, 0, Math.PI * 2);
        ctx.arc(pxB, pyB, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pxC, pyAxis, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#22d3ee';
        ctx.fillText(`(a, f(a))`, pxA + 6, pyA - 6);
        ctx.fillText(`(b, f(b))`, pxB + 6, pyB - 6);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`cₙ (chord intercept) = ${currentStep.c.toFixed(4)}`, pxC + 6, pyAxis - 10);
      }

      // (C) Newton-Raphson Visualization (Tangent line)
      if (activeVisualMethod === 'newton' && currentStep.xk !== undefined) {
        const pxK = toPxX(currentStep.xk);
        const pyK = toPxY(currentStep.fxk);
        const pxNext = toPxX(currentStep.xNext);
        const pyAxis = toPxY(0);

        const slope = currentStep.dfxk;
        const xExt1 = currentStep.xk - (currentStep.xNext - currentStep.xk) * 0.5;
        const yExt1 = currentStep.fxk + slope * (xExt1 - currentStep.xk);
        const xExt2 = currentStep.xNext + (currentStep.xNext - currentStep.xk) * 0.2;
        const yExt2 = currentStep.fxk + slope * (xExt2 - currentStep.xk);

        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(toPxX(xExt1), toPxY(yExt1));
        ctx.lineTo(toPxX(xExt2), toPxY(yExt2));
        ctx.stroke();

        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.beginPath();
        ctx.moveTo(pxK, pyK);
        ctx.lineTo(pxK, pyAxis);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pxNext, pyAxis);
        ctx.lineTo(pxNext, toPxY(evaluateAt(compiled, currentStep.xNext)));
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(pxK, pyK, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(pxNext, pyAxis, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#c084fc';
        ctx.fillText(`(xₙ, f(xₙ))`, pxK + 6, pyK - 8);
        ctx.fillStyle = '#34d399';
        ctx.fillText(`xₙ₊₁ = ${currentStep.xNext.toFixed(4)}`, pxNext + 6, pyAxis - 10);
      }

      // (D) Secant Method Visualization (Secant line across two successive points)
      if (activeVisualMethod === 'secant' && currentStep.xPrev !== undefined) {
        const pxPrev = toPxX(currentStep.xPrev);
        const pyPrev = toPxY(currentStep.fPrev);
        const pxCurr = toPxX(currentStep.xCurr);
        const pyCurr = toPxY(currentStep.fCurr);
        const pxNext = toPxX(currentStep.xNext);
        const pyAxis = toPxY(0);

        // Draw Secant line extending through both points
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pxPrev, pyPrev);
        ctx.lineTo(pxNext, pyAxis);
        ctx.stroke();

        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.beginPath();
        ctx.moveTo(pxNext, pyAxis);
        ctx.lineTo(pxNext, toPxY(currentStep.fxNext));
        ctx.stroke();
        ctx.setLineDash([]);

        // Points at (xPrev, fPrev), (xCurr, fCurr), and (xNext, 0)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(pxPrev, pyPrev, 5, 0, Math.PI * 2);
        ctx.arc(pxCurr, pyCurr, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(pxNext, pyAxis, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`xₙ₋₁`, pxPrev + 6, pyPrev - 6);
        ctx.fillText(`xₙ`, pxCurr + 6, pyCurr - 6);
        ctx.fillStyle = '#34d399';
        ctx.fillText(`xₙ₊₁ = ${currentStep.xNext.toFixed(4)}`, pxNext + 6, pyAxis - 10);
      }
    }

    // 6. Draw Final Root Beacon if found
    if (calculatedRoot !== undefined && calculatedRoot !== null && !isNaN(calculatedRoot)) {
      const rx = toPxX(calculatedRoot);
      const ry = toPxY(0);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rx, ry, 9, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(rx, ry, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.fillText(`Root ≈ ${calculatedRoot.toFixed(5)}`, rx - 35, ry + 24);
    }

  }, [viewWindow, equation, activeVisualMethod, currentStep, calculatedRoot]);

  // Interactive Pan Handlers
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    const rect = canvas.getBoundingClientRect();
    const xSpan = viewWindow.xMax - viewWindow.xMin;
    const ySpan = viewWindow.yMax - viewWindow.yMin;

    const xShift = (dx / rect.width) * xSpan;
    const yShift = (dy / rect.height) * ySpan;

    setViewWindow((prev) => ({
      ...prev,
      xMin: prev.xMin - xShift,
      xMax: prev.xMax - xShift,
      yMin: prev.yMin + yShift,
      yMax: prev.yMax + yShift
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (factor) => {
    setViewWindow((prev) => {
      const xMid = (prev.xMin + prev.xMax) / 2;
      const yMid = (prev.yMin + prev.yMax) / 2;
      const xSpan = (prev.xMax - prev.xMin) * factor;
      const ySpan = (prev.yMax - prev.yMin) * factor;
      return {
        xMin: xMid - xSpan / 2,
        xMax: xMid + xSpan / 2,
        yMin: yMid - ySpan / 2,
        yMax: yMid + ySpan / 2
      };
    });
  };

  const handleResetZoom = () => {
    setViewWindow({ xMin: -1, xMax: 4, yMin: -6, yMax: 10 });
  };

  return (
    <div className="glass-panel p-4 sm:p-5 md:p-6 mb-6">
      
      {/* Canvas Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        {/* Visual Method View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            Geometric Visualizer:
          </span>
          {method === 'compare' ? (
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'bisection', label: 'Bisection', activeCls: 'border-cyan-400 bg-cyan-500/15 text-cyan-300' },
                { id: 'regula_falsi', label: 'Regula Falsi', activeCls: 'border-amber-400 bg-amber-500/15 text-amber-300' },
                { id: 'newton', label: 'Newton-Raphson', activeCls: 'border-indigo-400 bg-indigo-500/15 text-indigo-300' },
                { id: 'secant', label: 'Secant', activeCls: 'border-emerald-400 bg-emerald-500/15 text-emerald-300' }
              ].map((m) => {
                const isActive = activeVisualMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCompareVisualMethod(m.id);
                      setCurrentStepIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isActive
                        ? m.activeCls
                        : 'border-white/10 bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-cyan-300 border border-cyan-500/30">
              {activeVisualMethod.replace('_', ' ').toUpperCase()} MODE
            </span>
          )}
        </div>

        {/* Playback & Zoom Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setCurrentStepIndex(0)}
              disabled={totalSteps <= 1}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              title="First Step"
            >
              <SkipBack size={14} />
            </button>
            
            <button
              onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
              disabled={currentStepIndex <= 0}
              className="px-2 py-1 rounded-lg text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Previous Step"
            >
              -1
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={totalSteps <= 1}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-sm transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              title={isPlaying ? 'Pause' : 'Play Step-by-Step'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-white" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => setCurrentStepIndex((p) => Math.min(totalSteps - 1, p + 1))}
              disabled={currentStepIndex >= totalSteps - 1}
              className="px-2 py-1 rounded-lg text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Next Step"
            >
              +1
            </button>

            <button
              onClick={() => setCurrentStepIndex(totalSteps - 1)}
              disabled={totalSteps <= 1}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Final Step"
            >
              <SkipForward size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>

            <button
              onClick={() => handleZoom(1.25)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>

            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Reset View Window"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Step Indicator Tracker */}
      <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
        <span>
          Step <strong className="text-cyan-300 font-mono">{totalSteps > 0 ? currentStepIndex + 1 : 0}</strong> of <strong className="text-slate-200 font-mono">{totalSteps}</strong>
        </span>
        <span className="hidden sm:inline text-slate-500">
          Click &amp; drag canvas to pan • Scroll to zoom
        </span>
      </div>

      {/* Main Canvas Viewport */}
      <div className={`relative rounded-xl overflow-hidden border border-white/10 shadow-inner bg-slate-950 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
        <canvas
          ref={canvasRef}
          width={860}
          height={380}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-auto block"
        />
      </div>

    </div>
  );
}
