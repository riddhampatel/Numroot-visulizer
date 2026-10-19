import * as math from 'mathjs';

/**
 * Safely parse and compile an expression string with user-friendly mathematical sanitation.
 */
export function compileExpression(exprStr) {
  try {
    if (!exprStr || typeof exprStr !== 'string' || !exprStr.trim()) {
      return { compiled: null, sanitized: '', error: 'Please enter a mathematical expression.' };
    }

    // Sanitize user-friendly mathematical notations:
    let sanitized = exprStr.trim()
      // e^x or e^(...) or e^-x -> exp(...)
      .replace(/e\^([a-zA-Z0-9()._-]+)/g, 'exp($1)')
      // natural log ln(x) -> log(x) in mathjs
      .replace(/\bln\s*\(/g, 'log(')
      // Implicit multiplication with variables/parentheses: 2x -> 2*x, 3cos(x) -> 3*cos(x)
      // Negative lookbehind / careful replacement so scientific notation 1e-5 or 2e3 is preserved
      .replace(/(^|[^a-zA-Z0-9_])(\d+)\s*([a-df-zA-DF-Z(])/g, '$1$2*$3')
      .replace(/(\d+)\s*([a-df-zA-DF-Z(])/g, '$1*$2')
      // Implicit parentheses multiplication: (x-1)(x+2) -> (x-1)*(x+2)
      .replace(/\)\s*\(/g, ')*(')
      .replace(/\)\s*([a-zA-Z0-9])/g, ')*$1');

    const compiled = math.compile(sanitized);

    // Verify syntax with safe scope without crashing on functions whose domain excludes 1
    const testPoints = [1, 0, 2, 0.5, 3];
    for (const testX of testPoints) {
      try {
        compiled.evaluate({ x: testX, e: Math.E, pi: Math.PI });
        break;
      } catch {
        // Try next test point
      }
    }
    // If all failed, compilation itself succeeded; errors during evaluation will be caught safely
    return { compiled, sanitized, error: null };
  } catch (err) {
    return { compiled: null, sanitized: exprStr, error: err.message };
  }
}

/**
 * Safely evaluate f(x) for a given compiled expression or string.
 */
export function evaluateAt(compiledExpr, xVal) {
  try {
    const scope = { x: xVal, e: Math.E, pi: Math.PI };
    const val = typeof compiledExpr === 'string'
      ? math.evaluate(compiledExpr, scope)
      : compiledExpr.evaluate(scope);

    if (typeof val === 'object' && val?.isComplex) {
      return NaN; // Ignore complex values for real root finding
    }
    const num = Number(val);
    return isFinite(num) ? num : NaN;
  } catch {
    return NaN;
  }
}

/**
 * Compute derivative f'(x) analytically using mathjs with central-difference fallback.
 * Returns both the evaluator function and human-readable formula string.
 */
export function getDerivativeEvaluator(exprStr) {
  const { sanitized, compiled: fallbackCompiled } = compileExpression(exprStr);
  let formulaStr = '';

  try {
    const targetExpr = sanitized || exprStr;
    const parsed = math.parse(targetExpr);
    const dParsed = math.derivative(parsed, 'x');
    const simplified = math.simplify(dParsed);
    formulaStr = simplified.toString();
    const compiledDeriv = simplified.compile();

    return {
      evaluate: (x) => evaluateAt(compiledDeriv, x),
      formulaStr
    };
  } catch {
    // Numerical central difference fallback: f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
    const h = 1e-6;
    return {
      evaluate: (x) => {
        if (!fallbackCompiled) return NaN;
        const y1 = evaluateAt(fallbackCompiled, x + h);
        const y0 = evaluateAt(fallbackCompiled, x - h);
        return (y1 - y0) / (2 * h);
      },
      formulaStr: 'Numerical Central Difference approximation: [f(x+h) - f(x-h)] / 2h'
    };
  }
}

/**
 * Bisection Method Execution (Bracket-based)
 */
export function runBisection({
  expression,
  a: rawA,
  b: rawB,
  tolerance = 1e-5,
  maxIterations = 35
}) {
  let a = Number(rawA);
  let b = Number(rawB);

  if (isNaN(a) || isNaN(b)) {
    return { success: false, error: 'Initial bounds a and b must be valid numbers.' };
  }

  if (a > b) {
    [a, b] = [b, a]; // Ensure a < b
  }

  const { compiled, error } = compileExpression(expression);
  if (error || !compiled) {
    return { success: false, error: `Invalid equation: ${error || 'Could not compile'}` };
  }

  let fa = evaluateAt(compiled, a);
  let fb = evaluateAt(compiled, b);

  if (isNaN(fa) || isNaN(fb)) {
    return { success: false, error: `Function returned undefined or invalid values at a=${a} or b=${b}.` };
  }

  // Exact root at boundaries
  if (Math.abs(fa) < 1e-14) {
    return {
      success: true,
      method: 'Bisection',
      root: a,
      finalResidual: 0,
      converged: true,
      iterations: 1,
      steps: [{ iteration: 1, stepIndex: 0, a, b, c: a, fa, fb, fc: fa, error: 0, relativeError: null }],
      message: `Exact root found at lower boundary a = ${a}`
    };
  }
  if (Math.abs(fb) < 1e-14) {
    return {
      success: true,
      method: 'Bisection',
      root: b,
      finalResidual: 0,
      converged: true,
      iterations: 1,
      steps: [{ iteration: 1, stepIndex: 0, a, b, c: b, fa, fb, fc: fb, error: 0, relativeError: null }],
      message: `Exact root found at upper boundary b = ${b}`
    };
  }

  // Intermediate Value Theorem check
  if (fa * fb > 0) {
    return {
      success: false,
      error: `Intermediate Value Theorem violated: f(a) and f(b) have the same sign (f(${a})=${fa.toFixed(4)}, f(${b})=${fb.toFixed(4)}). Choose an interval [a, b] where f(a) · f(b) < 0.`
    };
  }

  const steps = [];
  let prevC = null;
  let root = null;
  let converged = false;

  for (let k = 1; k <= maxIterations; k++) {
    const c = (a + b) / 2;
    const fc = evaluateAt(compiled, c);
    const absError = Math.abs(b - a) / 2;
    const relError = prevC !== null ? (Math.abs(c - prevC) / (Math.abs(c) + 1e-14)) * 100 : null;

    steps.push({
      iteration: k,
      stepIndex: k - 1,
      a,
      b,
      c,
      fa,
      fb,
      fc,
      error: absError,
      relativeError: relError
    });

    if (Math.abs(fc) < 1e-14 || Math.abs(fc) < tolerance || absError < tolerance) {
      root = c;
      converged = true;
      break;
    }

    // Narrow bracket
    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
    prevC = c;
  }

  if (!converged && steps.length > 0) {
    root = steps[steps.length - 1].c;
  }

  const finalResidual = root !== null && !isNaN(root) ? Math.abs(evaluateAt(compiled, root)) : NaN;

  return {
    success: true,
    method: 'Bisection',
    root,
    finalResidual,
    converged,
    iterations: steps.length,
    steps,
    tolerance
  };
}

/**
 * Regula Falsi Method (Method of False Position / Linear Interpolation)
 */
export function runRegulaFalsi({
  expression,
  a: rawA,
  b: rawB,
  tolerance = 1e-5,
  maxIterations = 35
}) {
  let a = Number(rawA);
  let b = Number(rawB);

  if (isNaN(a) || isNaN(b)) {
    return { success: false, error: 'Initial bounds a and b must be valid numbers.' };
  }

  if (a > b) {
    [a, b] = [b, a];
  }

  const { compiled, error } = compileExpression(expression);
  if (error || !compiled) {
    return { success: false, error: `Invalid equation: ${error || 'Could not compile'}` };
  }

  let fa = evaluateAt(compiled, a);
  let fb = evaluateAt(compiled, b);

  if (isNaN(fa) || isNaN(fb)) {
    return { success: false, error: `Function returned undefined or invalid values at a=${a} or b=${b}.` };
  }

  if (Math.abs(fa) < 1e-14) {
    return {
      success: true,
      method: 'Regula Falsi',
      root: a,
      finalResidual: 0,
      converged: true,
      iterations: 1,
      steps: [{ iteration: 1, stepIndex: 0, a, b, c: a, fa, fb, fc: fa, error: 0, relativeError: null }],
      message: `Exact root found at lower boundary a = ${a}`
    };
  }
  if (Math.abs(fb) < 1e-14) {
    return {
      success: true,
      method: 'Regula Falsi',
      root: b,
      finalResidual: 0,
      converged: true,
      iterations: 1,
      steps: [{ iteration: 1, stepIndex: 0, a, b, c: b, fa, fb, fc: fb, error: 0, relativeError: null }],
      message: `Exact root found at upper boundary b = ${b}`
    };
  }

  if (fa * fb > 0) {
    return {
      success: false,
      error: `Intermediate Value Theorem violated: f(a) and f(b) have the same sign (f(${a})=${fa.toFixed(4)}, f(${b})=${fb.toFixed(4)}). Choose an interval [a, b] where f(a) · f(b) < 0.`
    };
  }

  const steps = [];
  let prevC = null;
  let root = null;
  let converged = false;

  for (let k = 1; k <= maxIterations; k++) {
    const denom = fb - fa;
    if (Math.abs(denom) < 1e-15) {
      return {
        success: false,
        steps,
        error: `Division by zero: f(b) - f(a) ≈ 0 at iteration ${k}. Points are horizontal.`
      };
    }

    // Regula Falsi Chord Intercept formula: c = (a*f(b) - b*f(a)) / (f(b) - f(a))
    const c = (a * fb - b * fa) / denom;
    const fc = evaluateAt(compiled, c);
    const absError = prevC !== null ? Math.abs(c - prevC) : Math.abs(b - a);
    const relError = prevC !== null ? (Math.abs(c - prevC) / (Math.abs(c) + 1e-14)) * 100 : null;

    steps.push({
      iteration: k,
      stepIndex: k - 1,
      a,
      b,
      c,
      fa,
      fb,
      fc,
      error: absError,
      relativeError: relError
    });

    if (Math.abs(fc) < 1e-14 || Math.abs(fc) < tolerance || (prevC !== null && absError < tolerance)) {
      root = c;
      converged = true;
      break;
    }

    // Update bracket
    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
    prevC = c;
  }

  if (!converged && steps.length > 0) {
    root = steps[steps.length - 1].c;
  }

  const finalResidual = root !== null && !isNaN(root) ? Math.abs(evaluateAt(compiled, root)) : NaN;

  return {
    success: true,
    method: 'Regula Falsi',
    root,
    finalResidual,
    converged,
    iterations: steps.length,
    steps,
    tolerance
  };
}

/**
 * Newton-Raphson Method Execution (Open Tangent-based)
 */
export function runNewtonRaphson({
  expression,
  x0: rawX0,
  tolerance = 1e-5,
  maxIterations = 30
}) {
  const x0 = Number(rawX0);
  if (isNaN(x0)) {
    return { success: false, error: 'Initial guess x₀ must be a valid number.' };
  }

  const { compiled, error } = compileExpression(expression);
  if (error || !compiled) {
    return { success: false, error: `Invalid equation: ${error || 'Could not compile'}` };
  }

  const derivInfo = getDerivativeEvaluator(expression);
  const evalDeriv = derivInfo.evaluate;
  const steps = [];
  let currentX = x0;
  let root = null;
  let converged = false;

  for (let k = 1; k <= maxIterations; k++) {
    const fx = evaluateAt(compiled, currentX);
    const dfx = evalDeriv(currentX);

    if (isNaN(fx) || isNaN(dfx)) {
      return {
        success: false,
        error: `Function or derivative evaluated to NaN at iteration ${k} (x = ${currentX}).`
      };
    }

    // Zero derivative / horizontal tangent guard
    if (Math.abs(dfx) < 1e-12) {
      return {
        success: false,
        steps,
        error: `Derivative is nearly zero at x = ${currentX.toFixed(5)} (|f'(x)| < 10⁻¹²). Tangent line is horizontal; division by zero prevented.`
      };
    }

    const xNext = currentX - fx / dfx;
    const fxNext = evaluateAt(compiled, xNext);

    // Non-finite check
    if (!isFinite(xNext) || isNaN(xNext)) {
      return {
        success: false,
        steps,
        error: `Next approximation xₙ₊₁ evaluated to a non-finite value at iteration ${k}. Check expression domain.`
      };
    }

    const absError = Math.abs(xNext - currentX);
    const relError = (absError / (Math.abs(xNext) + 1e-14)) * 100;

    steps.push({
      iteration: k,
      stepIndex: k - 1,
      xk: currentX,
      fxk: fx,
      dfxk: dfx,
      xNext,
      fxNext,
      error: absError,
      relativeError: relError
    });

    if (absError < tolerance || Math.abs(fxNext) < tolerance || Math.abs(fx) < tolerance) {
      root = xNext;
      converged = true;
      break;
    }

    // Divergence check
    if (Math.abs(xNext) > 1e9) {
      return {
        success: false,
        steps,
        error: `Method diverged: |x| exceeded 10⁹ at iteration ${k}. Try an initial guess closer to the root.`
      };
    }

    currentX = xNext;
  }

  if (!converged && steps.length > 0) {
    root = steps[steps.length - 1].xNext;
  }

  const finalResidual = root !== null && !isNaN(root) ? Math.abs(evaluateAt(compiled, root)) : NaN;

  return {
    success: true,
    method: 'Newton-Raphson',
    root,
    derivativeFormula: derivInfo.formulaStr,
    finalResidual,
    converged,
    iterations: steps.length,
    steps,
    tolerance
  };
}

/**
 * Secant Method Execution (Open Secant-based with 2 initial estimates)
 */
export function runSecant({
  expression,
  x0: rawX0,
  x1: rawX1,
  tolerance = 1e-5,
  maxIterations = 30
}) {
  let x0 = Number(rawX0);
  let x1 = Number(rawX1);

  if (isNaN(x0) || isNaN(x1)) {
    return { success: false, error: 'Initial estimates x₀ and x₁ must be valid numbers.' };
  }

  const { compiled, error } = compileExpression(expression);
  if (error || !compiled) {
    return { success: false, error: `Invalid equation: ${error || 'Could not compile'}` };
  }

  let xPrev = x0;
  let xCurr = x1;
  let fPrev = evaluateAt(compiled, xPrev);
  let fCurr = evaluateAt(compiled, xCurr);

  if (isNaN(fPrev) || isNaN(fCurr)) {
    return { success: false, error: `Function returned undefined at initial points x₀=${x0} or x₁=${x1}.` };
  }

  const steps = [];
  let root = null;
  let converged = false;

  for (let k = 1; k <= maxIterations; k++) {
    const denom = fCurr - fPrev;
    if (Math.abs(denom) < 1e-15) {
      return {
        success: false,
        steps,
        error: `Division by zero: f(xₖ) - f(xₖ₋₁) ≈ 0 at iteration ${k}. The secant line is horizontal.`
      };
    }

    // Secant formula: x_{k+1} = x_k - f(x_k) * (x_k - x_{k-1}) / (f(x_k) - f(x_{k-1}))
    const xNext = xCurr - fCurr * ((xCurr - xPrev) / denom);
    const fxNext = evaluateAt(compiled, xNext);

    if (!isFinite(xNext) || isNaN(xNext)) {
      return {
        success: false,
        steps,
        error: `Approximation xₖ₊₁ evaluated to a non-finite value at iteration ${k}.`
      };
    }

    const absError = Math.abs(xNext - xCurr);
    const relError = (absError / (Math.abs(xNext) + 1e-14)) * 100;

    steps.push({
      iteration: k,
      stepIndex: k - 1,
      xPrev,
      xCurr,
      fPrev,
      fCurr,
      xNext,
      fxNext,
      error: absError,
      relativeError: relError
    });

    if (absError < tolerance || Math.abs(fxNext) < tolerance) {
      root = xNext;
      converged = true;
      break;
    }

    if (Math.abs(xNext) > 1e9) {
      return {
        success: false,
        steps,
        error: `Secant method diverged: |x| exceeded 10⁹ at iteration ${k}.`
      };
    }

    xPrev = xCurr;
    fPrev = fCurr;
    xCurr = xNext;
    fCurr = fxNext;
  }

  if (!converged && steps.length > 0) {
    root = steps[steps.length - 1].xNext;
  }

  const finalResidual = root !== null && !isNaN(root) ? Math.abs(evaluateAt(compiled, root)) : NaN;

  return {
    success: true,
    method: 'Secant',
    root,
    finalResidual,
    converged,
    iterations: steps.length,
    steps,
    tolerance
  };
}
