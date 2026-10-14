import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, RefreshCw, Eye } from 'lucide-react';
import { compileExpression, evaluateAt } from '../utils/numericalMethods';

export default function GraphCanvas({
  equation,
  method,
  bisectionResult,
  newtonResult,
  currentStepIndex,
  setCurrentStepIndex
}) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewWindow, setViewWindow] = useState({ xMin: -1, xMax: 4, yMin: -6, yMax: 10 });

  // Get active step data based on selected method
  const activeSteps = method === 'newton'
    ? (newtonResult?.steps || [])
    : (bisectionResult?.steps || []);

  const totalSteps = activeSteps.length;
  const currentStep = activeSteps[currentStepIndex] || null;
  const calculatedRoot = (method === 'newton' ? newtonResult?.root : bisectionResult?.root);

  // Auto adjust viewport when result changes
  useEffect(() => {
    let focusPoints = [];
    if (bisectionResult?.success && bisectionResult.steps?.length > 0) {
      const s0 = bisectionResult.steps[0];
      focusPoints.push(s0.a, s0.b);
    }
    if (newtonResult?.success && newtonResult.steps?.length > 0) {
      const s0 = newtonResult.steps[0];
      focusPoints.push(s0.xk);
    }
    if (calculatedRoot !== undefined && calculatedRoot !== null && !isNaN(calculatedRoot)) {
      focusPoints.push(calculatedRoot);
    }

    if (focusPoints.length > 0) {
      const minX = Math.min(...focusPoints);
      const maxX = Math.max(...focusPoints);
      const padding = Math.max(Math.abs(maxX - minX) * 0.8, 1.5);
      setViewWindow({
        xMin: minX - padding,
        xMax: maxX + padding,
        yMin: -8,
        yMax: 8
      });
    }
  }, [bisectionResult, newtonResult, method, calculatedRoot]);

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
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Subtle Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Grid X ticks
    const xRange = xMax - xMin;
    const xStep = Math.pow(10, Math.floor(Math.log10(xRange))) / (xRange > 15 ? 1 : 2);
    const firstX = Math.floor(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      const px = toPxX(x);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      // Label
      if (Math.abs(x) > 1e-6) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(x.toFixed(1), px + 3, toPxY(0) + 12);
      }
    }

    // Grid Y ticks
    const yRange = yMax - yMin;
    const yStep = Math.pow(10, Math.floor(Math.log10(yRange))) / (yRange > 15 ? 1 : 2);
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
      const numSamples = width; // 1 sample per pixel for maximum smoothness
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
      // Bisection Visualization: Highlight [a, b] bracket and midpoint c
      if (currentStep.a !== undefined && currentStep.b !== undefined) {
        const pxA = toPxX(currentStep.a);
        const pxB = toPxX(currentStep.b);
        const pxC = toPxX(currentStep.c);

        // Translucent shaded bracket region
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.fillRect(pxA, 0, pxB - pxA, height);

        // Bounds a and b vertical markers
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;

        // Line a
        ctx.beginPath();
        ctx.moveTo(pxA, 0);
        ctx.lineTo(pxA, height);
        ctx.stroke();

        // Line b
        ctx.beginPath();
        ctx.moveTo(pxB, 0);
        ctx.lineTo(pxB, height);
        ctx.stroke();

        // Midpoint c vertical line
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(pxC, 0);
        ctx.lineTo(pxC, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Node at (c, f(c))
        const pyFc = toPxY(currentStep.fc);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pxC, pyFc, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Midpoint on X axis
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pxC, toPxY(0), 4, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#22d3ee';
        ctx.fillText(`a: ${currentStep.a.toFixed(3)}`, pxA + 4, 25);
        ctx.fillText(`b: ${currentStep.b.toFixed(3)}`, pxB - 65, 25);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`mid c: ${currentStep.c.toFixed(4)}`, pxC + 5, 45);
      }

      // Newton-Raphson Visualization: Tangent line from (x_k, f(x_k)) down to (x_{k+1}, 0)
      if (currentStep.xk !== undefined && currentStep.xNext !== undefined) {
        const pxK = toPxX(currentStep.xk);
        const pyK = toPxY(currentStep.fxk);
        const pxNext = toPxX(currentStep.xNext);
        const pyAxis = toPxY(0);

        // Tangent line extending beyond points
        const slope = currentStep.dfxk;
        const xExt1 = currentStep.xk - (currentStep.xNext - currentStep.xk) * 0.5;
        const yExt1 = currentStep.fxk + slope * (xExt1 - currentStep.xk);
        const xExt2 = currentStep.xNext + (currentStep.xNext - currentStep.xk) * 0.2;
        const yExt2 = currentStep.fxk + slope * (xExt2 - currentStep.xk);

        ctx.strokeStyle = '#a855f7'; // Purple tangent line
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(toPxX(xExt1), toPxY(yExt1));
        ctx.lineTo(toPxX(xExt2), toPxY(yExt2));
        ctx.stroke();

        // Vertical drop from (xk, fxk) to (xk, 0)
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.beginPath();
        ctx.moveTo(pxK, pyK);
        ctx.lineTo(pxK, pyAxis);
        ctx.stroke();

        // Vertical line to next step point on curve
        ctx.beginPath();
        ctx.moveTo(pxNext, pyAxis);
        ctx.lineTo(pxNext, toPxY(evaluateAt(compiled, currentStep.xNext)));
        ctx.stroke();
        ctx.setLineDash([]);

        // Current node (xk, fxk)
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(pxK, pyK, 6, 0, Math.PI * 2);
        ctx.fill();

        // Next approximation on x-axis (xNext, 0)
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(pxNext, pyAxis, 6, 0, Math.PI * 2);
        ctx.fill();

        // Text Labels
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#c084fc';
        ctx.fillText(`(x${currentStep.iteration-1}, f(x))`, pxK + 6, pyK - 8);
        ctx.fillStyle = '#34d399';
        ctx.fillText(`x${currentStep.iteration} = ${currentStep.xNext.toFixed(4)}`, pxNext + 6, pyAxis - 10);
      }
    }

    // 6. Draw Final Root Beacon if found
    if (calculatedRoot !== undefined && calculatedRoot !== null && !isNaN(calculatedRoot)) {
      const rx = toPxX(calculatedRoot);
      const ry = toPxY(0);

      // Outer glowing ring
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rx, ry, 9, 0, Math.PI * 2);
      ctx.stroke();

      // Solid inner core
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(rx, ry, 5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.fillText(`Root ≈ ${calculatedRoot.toFixed(5)}`, rx - 35, ry + 24);
    }

  }, [viewWindow, equation, method, currentStep, calculatedRoot]);

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
      xMin: prev.xMin - xShift,
      xMax: prev.xMax - xShift,
      yMin: prev.yMin + yShift,
      yMax: prev.yMax + yShift
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom handlers
  const handleZoom = (factor) => {
    setViewWindow((prev) => {
      const cx = (prev.xMin + prev.xMax) / 2;
      const cy = (prev.yMin + prev.yMax) / 2;
      const halfW = ((prev.xMax - prev.xMin) / 2) * factor;
      const halfH = ((prev.yMax - prev.yMin) / 2) * factor;
      return {
        xMin: cx - halfW,
        xMax: cx + halfW,
        yMin: cy - halfH,
        yMax: cy + halfH
      };
    });
  };

  const handleResetZoom = () => {
    setViewWindow({ xMin: -2, xMax: 4, yMin: -6, yMax: 8 });
  };

  return (
    <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '24px' }}>
      
      {/* Header & Controls bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Eye size={18} color="#38bdf8" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Function Plot & Convergence Canvas
          </h2>
          {totalSteps > 0 && (
            <span className="badge badge-indigo">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          )}
        </div>

        {/* Viewport Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginRight: '4px' }}>
            Drag to pan
          </span>
          <button
            onClick={() => handleZoom(0.75)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => handleZoom(1.33)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={handleResetZoom}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Reset Graph Bounds"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* HTML5 Canvas */}
      <div style={{ width: '100%', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
        <canvas
          ref={canvasRef}
          width={900}
          height={380}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        />
      </div>

      {/* Step Player Controls */}
      {totalSteps > 0 && (
        <div style={{
          marginTop: '14px',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          
          {/* Step buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentStepIndex(0)}
              disabled={currentStepIndex === 0}
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
              title="First Iteration"
            >
              <SkipBack size={14} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play Animation'}
            </button>

            <button
              onClick={() => setCurrentStepIndex((p) => Math.min(totalSteps - 1, p + 1))}
              disabled={currentStepIndex >= totalSteps - 1}
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
              title="Next Iteration"
            >
              <SkipForward size={14} />
            </button>
          </div>

          {/* Step Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              k = 1
            </span>
            <input
              type="range"
              min={0}
              max={totalSteps - 1}
              value={currentStepIndex}
              onChange={(e) => {
                setCurrentStepIndex(Number(e.target.value));
                setIsPlaying(false);
              }}
              style={{ flex: 1, accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              k = {totalSteps}
            </span>
          </div>

          {/* Active Step Metric Badge */}
          {currentStep && (
            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Approx Root: <strong style={{ color: '#38bdf8' }}>
                {(currentStep.c ?? currentStep.xNext ?? 0).toFixed(6)}
              </strong>
              {' '}| Error: <strong style={{ color: '#fbbf24' }}>
                {(currentStep.error || 0).toExponential(3)}
              </strong>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
