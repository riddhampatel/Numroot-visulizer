import React from 'react';
import { Download, Table as TableIcon, CheckCircle2, AlertTriangle, FunctionSquare } from 'lucide-react';

export default function IterationTable({
  result,
  methodName,
  currentStepIndex,
  onSelectStep
}) {
  if (!result) return null;

  const { steps = [], root, converged, iterations, error, tolerance, derivativeFormula } = result;
  const isBisection = methodName.toLowerCase().includes('bisection');
  const isRegulaFalsi = methodName.toLowerCase().includes('regula');
  const isNewton = methodName.toLowerCase().includes('newton');
  const isSecant = methodName.toLowerCase().includes('secant');

  const handleExportCSV = () => {
    if (!steps.length) return;

    const fmtFix = (num, digits = 8) => (typeof num === 'number' && !isNaN(num) ? num.toFixed(digits) : 'N/A');
    const fmtExp = (num, digits = 4) => (typeof num === 'number' && !isNaN(num) ? num.toExponential(digits) : 'N/A');

    let headers = [];
    let rows = [];

    if (isBisection || isRegulaFalsi) {
      headers = ['Iteration (n)', 'a_n', 'b_n', 'c_n', 'f(a_n)', 'f(b_n)', 'f(c_n)', 'Abs Error', 'Rel Error (%)'];
      rows = steps.map((s) => [
        s.iteration,
        fmtFix(s.a),
        fmtFix(s.b),
        fmtFix(s.c),
        fmtExp(s.fa),
        fmtExp(s.fb),
        fmtExp(s.fc),
        fmtExp(s.error, 6),
        s.relativeError !== null && s.relativeError !== undefined && !isNaN(s.relativeError) ? s.relativeError.toFixed(4) : 'N/A'
      ]);
    } else if (isNewton) {
      headers = ['Iteration (n)', 'x_n', 'f(x_n)', "f'(x_n)", 'x_{n+1}', 'Abs Error', 'Rel Error (%)'];
      rows = steps.map((s) => [
        s.iteration,
        fmtFix(s.xk),
        fmtExp(s.fxk),
        fmtExp(s.dfxk),
        fmtFix(s.xNext),
        fmtExp(s.error, 6),
        s.relativeError !== null && s.relativeError !== undefined && !isNaN(s.relativeError) ? s.relativeError.toFixed(4) : 'N/A'
      ]);
    } else if (isSecant) {
      headers = ['Iteration (n)', 'x_{n-1}', 'x_n', 'f(x_{n-1})', 'f(x_n)', 'x_{n+1}', 'Abs Error', 'Rel Error (%)'];
      rows = steps.map((s) => [
        s.iteration,
        fmtFix(s.xPrev),
        fmtFix(s.xCurr),
        fmtExp(s.fPrev),
        fmtExp(s.fCurr),
        fmtFix(s.xNext),
        fmtExp(s.error, 6),
        s.relativeError !== null && s.relativeError !== undefined && !isNaN(s.relativeError) ? s.relativeError.toFixed(4) : 'N/A'
      ]);
    }

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${methodName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_iterations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-4 sm:p-5 md:p-6 mb-6">
      
      {/* Table Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <TableIcon size={18} className="text-indigo-400" />
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            {methodName} Iteration Table
          </h3>
          {converged ? (
            <span className="badge badge-emerald">
              <CheckCircle2 size={12} /> Converged in {iterations} steps
            </span>
          ) : (
            <span className="badge badge-amber">
              <AlertTriangle size={12} /> {error ? 'Halted' : 'Max iterations reached'}
            </span>
          )}
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!steps.length}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Download iteration history as CSV file"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Derivative Formula Display (For Newton-Raphson) */}
      {derivativeFormula && (
        <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 border border-indigo-500/25 rounded-xl mb-4 text-xs text-indigo-200">
          <FunctionSquare size={16} className="text-indigo-400 shrink-0" />
          <span>Analytical Derivative:</span>
          <code className="font-mono font-bold text-indigo-300 bg-slate-950/50 px-2 py-0.5 rounded border border-indigo-500/20">
            f'(x) = {derivativeFormula}
          </code>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3.5 bg-slate-900/60 rounded-xl border border-white/10">
        <div>
          <span className="block text-[11px] text-slate-400 uppercase font-semibold">Computed Root</span>
          <strong className="text-base sm:text-lg text-emerald-400 font-mono">
            {root !== undefined && root !== null && !isNaN(root) ? root.toFixed(7) : 'N/A'}
          </strong>
        </div>
        <div>
          <span className="block text-[11px] text-slate-400 uppercase font-semibold">Iterations</span>
          <strong className="text-base sm:text-lg text-slate-100 font-mono">
            {iterations ?? steps.length}
          </strong>
        </div>
        <div>
          <span className="block text-[11px] text-slate-400 uppercase font-semibold">Target Tolerance (ε)</span>
          <strong className="text-base sm:text-lg text-indigo-300 font-mono">
            {tolerance ? tolerance.toExponential(1) : '1.0e-5'}
          </strong>
        </div>
        <div>
          <span className="block text-[11px] text-slate-400 uppercase font-semibold">Final Residual |f(root)|</span>
          <strong className="text-base sm:text-lg text-amber-300 font-mono">
            {result.finalResidual !== undefined && !isNaN(result.finalResidual)
              ? result.finalResidual.toExponential(4)
              : (steps.length > 0
                  ? Math.abs(steps[steps.length - 1].fc ?? steps[steps.length - 1].fxNext ?? steps[steps.length - 1].fxk ?? 0).toExponential(4)
                  : 'N/A')}
          </strong>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs sm:text-sm mb-4">
          <strong>Algorithm Notice:</strong> {error}
        </div>
      )}

      {/* Responsive Table Scroll Container */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-xl border border-white/10 shadow-inner bg-slate-950/70">
        <table className="w-full border-collapse text-xs font-mono text-left">
          <thead>
            <tr className="bg-slate-900 sticky top-0 z-10 border-b border-white/10 text-slate-400 select-none">
              <th className="py-2.5 px-3.5">n</th>
              
              {isBisection && (
                <>
                  <th className="py-2.5 px-3.5 text-cyan-300">aₙ (Lower)</th>
                  <th className="py-2.5 px-3.5 text-cyan-300">bₙ (Upper)</th>
                  <th className="py-2.5 px-3.5 text-amber-300">cₙ (Midpoint)</th>
                  <th className="py-2.5 px-3.5 text-slate-400">f(aₙ)</th>
                  <th className="py-2.5 px-3.5 text-slate-400">f(bₙ)</th>
                  <th className="py-2.5 px-3.5 text-amber-300">f(cₙ)</th>
                </>
              )}

              {isRegulaFalsi && (
                <>
                  <th className="py-2.5 px-3.5 text-amber-300">aₙ</th>
                  <th className="py-2.5 px-3.5 text-amber-300">bₙ</th>
                  <th className="py-2.5 px-3.5 text-cyan-300">cₙ (Chord Root)</th>
                  <th className="py-2.5 px-3.5 text-slate-400">f(aₙ)</th>
                  <th className="py-2.5 px-3.5 text-slate-400">f(bₙ)</th>
                  <th className="py-2.5 px-3.5 text-cyan-300">f(cₙ)</th>
                </>
              )}

              {isNewton && (
                <>
                  <th className="py-2.5 px-3.5 text-indigo-300">xₙ (Current)</th>
                  <th className="py-2.5 px-3.5 text-slate-400">f(xₙ)</th>
                  <th className="py-2.5 px-3.5 text-slate-400">f'(xₙ)</th>
                  <th className="py-2.5 px-3.5 text-emerald-300">xₙ₊₁ (Next)</th>
                </>
              )}

              {isSecant && (
                <>
                  <th className="py-2.5 px-3.5 text-emerald-300">xₙ₋₁</th>
                  <th className="py-2.5 px-3.5 text-emerald-300">xₙ</th>
                  <th className="py-2.5 px-3.5 text-slate-400">f(xₙ₋₁)</th>
                  <th className="py-2.5 px-3.5 text-slate-400">f(xₙ)</th>
                  <th className="py-2.5 px-3.5 text-emerald-300">xₙ₊₁</th>
                </>
              )}

              <th className="py-2.5 px-3.5 text-slate-400">Abs Error</th>
              <th className="py-2.5 px-3.5 text-slate-400">Rel Error %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              return (
                <tr
                  key={step.iteration}
                  onClick={() => onSelectStep && onSelectStep(idx)}
                  className={`cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-100 font-semibold'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <td className={`py-2 px-3.5 ${isActive ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                    {step.iteration}
                  </td>

                  {isBisection && (
                    <>
                      <td className="py-2 px-3.5 text-slate-200">{step.a.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-slate-200">{step.b.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-amber-300 font-semibold">{step.c.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-slate-400">{step.fa.toExponential(3)}</td>
                      <td className="py-2 px-3.5 text-slate-400">{step.fb.toExponential(3)}</td>
                      <td className="py-2 px-3.5 text-amber-300">{step.fc.toExponential(3)}</td>
                    </>
                  )}

                  {isRegulaFalsi && (
                    <>
                      <td className="py-2 px-3.5 text-slate-200">{step.a.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-slate-200">{step.b.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-cyan-300 font-semibold">{step.c.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-slate-400">{step.fa.toExponential(3)}</td>
                      <td className="py-2 px-3.5 text-slate-400">{step.fb.toExponential(3)}</td>
                      <td className="py-2 px-3.5 text-cyan-300">{step.fc.toExponential(3)}</td>
                    </>
                  )}

                  {isNewton && (
                    <>
                      <td className="py-2 px-3.5 text-slate-200">{step.xk.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-slate-400">{step.fxk.toExponential(3)}</td>
                      <td className="py-2 px-3.5 text-slate-400">{step.dfxk.toExponential(3)}</td>
                      <td className="py-2 px-3.5 text-emerald-300 font-semibold">{step.xNext.toFixed(6)}</td>
                    </>
                  )}

                  {isSecant && (
                    <>
                      <td className="py-2 px-3.5 text-slate-200">{step.xPrev.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-slate-200">{step.xCurr.toFixed(6)}</td>
                      <td className="py-2 px-3.5 text-slate-400">{step.fPrev.toExponential(3)}</td>
                      <td className="py-2 px-3.5 text-slate-400">{step.fCurr.toExponential(3)}</td>
                      <td className="py-2 px-3.5 text-emerald-300 font-semibold">{step.xNext.toFixed(6)}</td>
                    </>
                  )}

                  <td className="py-2 px-3.5 text-slate-400">{step.error.toExponential(3)}</td>
                  <td className="py-2 px-3.5 text-slate-400">
                    {step.relativeError !== null && step.relativeError !== undefined
                      ? `${step.relativeError.toFixed(3)}%`
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
