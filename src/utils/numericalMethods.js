import * as math from 'mathjs';

/**
 * Safely parse and compile an expression string.
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
      // Implicit multiplication: 2x -> 2*x, 3cos(x) -> 3*cos(x)
      .replace(/(\d+)\s*([a-zA-Z(])/g, '$1*$2')
      // Implicit parentheses multiplication: (x-1)(x+2) -> (x-1)*(x+2)
      .replace(/\)\s*\(/g, ')*(')
      .replace(/\)\s*([a-zA-Z0-9])/g, ')*$1');

    const compiled = math.compile(sanitized);
    // Test evaluation at x = 1 and x = 2 to verify syntax
    compiled.evaluate({ x: 1, e: Math.E, pi: Math.PI });
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

    if (typeof val === 'object' && val.isComplex) {
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
 */
export function getDerivativeEvaluator(exprStr) {
  try {
    const parsed = math.parse(exprStr);
    const dParsed = math.derivative(parsed, 'x');
    const compiled = dParsed.compile();
    return (x) => evaluateAt(compiled, x);
  } catch {
    // Numerical central difference fallback: f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
    const { compiled } = compileExpression(exprStr);
    const h = 1e-6;
    return (x) => {
      if (!compiled) return NaN;
      const y1 = evaluateAt(compiled, x + h);
      const y0 = evaluateAt(compiled, x - h);
      return (y1 - y0) / (2 * h);
    };
  }
}

/**
 * Bisection Method Execution
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
      root: a,
      iterations: 0,
      steps: [{ iteration: 0, a, b, c: a, fa, fb, fc: fa, error: 0, relativeError: 0 }],
      message: `Exact root found at lower boundary a = ${a}`
    };
  }
  if (Math.abs(fb) < 1e-14) {
    return {
      success: true,
      root: b,
      iterations: 0,
      steps: [{ iteration: 0, a, b, c: b, fa, fb, fc: fb, error: 0, relativeError: 0 }],
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
    const relError = prevC !== null ? (Math.abs(c - prevC) / (Math.abs(c) + 1e-14)) * 100 : 100;

    steps.push({
      iteration: k,
      a,
      b,
      c,
      fa,
      fb,
      fc,
      error: absError,
      relativeError: relError
    });

    if (Math.abs(fc) < 1e-14 || absError < tolerance) {
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

  if (!converged) {
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
 * Newton-Raphson Method Execution
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

  const evalDeriv = getDerivativeEvaluator(expression);
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
      xk: currentX,
      fxk: fx,
      dfxk: dfx,
      xNext,
      error: absError,
      relativeError: relError
    });

    if (absError < tolerance || Math.abs(fx) < tolerance) {
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
    finalResidual,
    converged,
    iterations: steps.length,
    steps,
    tolerance
  };
}
