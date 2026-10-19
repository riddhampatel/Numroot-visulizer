# NumRoot Visualizer — Numerical Methods & Root-Finding Simulator

> **Course:** Foundation of Mathematics (FM)  
> **Unit:** Unit 2 — Numerical Methods  
> **Topic:** Interactive Non-Linear Equation Root-Finding & Convergence Analysis in Computing  
> **Methods Covered:** Bisection Method, Regula Falsi Method, Newton–Raphson Method & Secant Method

An interactive, high-performance web simulator demonstrating how mathematical root-finding algorithms solve non-linear equations in computer science. Built with **React**, **Vite**, and **Math.js** for 100% client-side execution with zero backend latency.

---

## 📋 Table of Contents

1. [Project Overview & Objectives](#-project-overview--objectives)
2. [Mathematical Theory & Formulations](#-mathematical-theory--formulations)
   - [Bisection Method](#1-the-bisection-method-bracket-based)
   - [Regula Falsi Method](#2-the-regula-falsi-method-bracket-chord-based)
   - [Newton–Raphson Method](#3-the-newtonraphson-method-open-tangent-based)
   - [Secant Method](#4-the-secant-method-open-chord-based)
   - [Theoretical Convergence Comparison](#5-theoretical-convergence-comparison)
3. [Computer Science & Real-World Applications](#-computer-science--real-world-applications)
4. [Key Features & Capabilities](#-key-features--capabilities)
5. [Edge-Case Safeguards & Numerical Stability](#-edge-case-safeguards--numerical-stability)
6. [Technology Stack & Architecture](#-technology-stack--architecture)
7. [Installation & Local Setup](#-installation--local-setup)
8. [Deployment Guide (Vercel)](#-deployment-guide-vercel)

---

## 🎯 Project Overview & Objectives

In computer software, analytical closed-form solutions rarely exist for complex engineering equations. Software systems instead rely on numerical algorithms to approximate solutions to arbitrary precision.

### Core Objectives:

- **Interactive Visualization**: Graph continuous non-linear functions $f(x)$ with dynamic interval brackets, chords, and tangent line descents.
- **Algorithmic Comparison**: Directly compare bracket-based linear convergence ($p = 1$), superlinear chord convergence ($p \approx 1.618$), and open tangent-based quadratic convergence ($p = 2$).
- **Practical Computer Science Link**: Demonstrate how algorithms like Bisection, Regula Falsi, Newton–Raphson, and Secant power real-world 3D graphics shaders, game physics engines, and machine learning optimizations.
- **Data Reproducibility**: Provide full iteration tables with textbook notations, live analytical derivative calculation, error tracking, and instant CSV data export.

---

## 📐 Mathematical Theory & Formulations

### 1. The Bisection Method (Bracket-Based)

The Bisection method is based on the **Intermediate Value Theorem (IVT)**:

> If a continuous function $f(x)$ changes sign over an interval $[a, b]$ such that $f(a) \cdot f(b) < 0$, then there exists at least one real root $c \in (a, b)$ where $f(c) = 0$.

#### Algorithm Steps:
1. Verify $f(a) \cdot f(b) < 0$. If $f(a) = 0$ or $f(b) = 0$, an exact boundary root is identified.
2. Compute the midpoint:
   $$c_n = \frac{a_n + b_n}{2}$$
3. Evaluate $f(c_n)$:
   - If $|f(c_n)| < \text{tolerance}$ or $\frac{|b_n - a_n|}{2} < \text{tolerance}$, stop.
   - If $f(a_n) \cdot f(c_n) < 0$, set $b_{n+1} = c_n$.
   - Otherwise, set $a_{n+1} = c_n$.
4. **Convergence Rate**: Guaranteed Linear ($p = 1$). Error strictly halves each step:
   $$|e_n| \le \frac{b_0 - a_0}{2^n}$$

---

### 2. The Regula Falsi Method (Bracket Chord-Based)

Also known as the **Method of False Position**, Regula Falsi improves upon Bisection by connecting the points $(a, f(a))$ and $(b, f(b))$ with a linear secant chord rather than taking a blind midpoint.

#### Formula:
$$c_n = \frac{a_n \cdot f(b_n) - b_n \cdot f(a_n)}{f(b_n) - f(a_n)}$$

- Retains guaranteed bracketing safety: $f(a) \cdot f(b) < 0$.
- **Convergence Rate**: Linear ($p = 1$), but typically reaches high accuracy in fewer iterations than Bisection for smooth curves.

---

### 3. The Newton–Raphson Method (Open Tangent-Based)

Derived from the **Taylor Series expansion** truncated after the first derivative term:
$$f(x_{n+1}) \approx f(x_n) + f'(x_n)(x_{n+1} - x_n) = 0$$

Solving for $x_{n+1}$ gives the standard iteration formula:
$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

#### Algorithm Steps:
1. Select an initial guess $x_0$.
2. Compute analytical derivative $f'(x_n)$ and function value $f(x_n)$.
3. Check for horizontal tangent: $|f'(x_n)| < 10^{-12}$.
4. Calculate $x_{n+1}$.
5. **Convergence Rate**: Local Quadratic ($p = 2$) near a simple root:
   $$|e_{n+1}| \approx C \cdot |e_n|^2$$
   The number of correct decimal places approximately doubles each iteration.

---

### 4. The Secant Method (Open Chord-Based)

When the analytical derivative $f'(x)$ is difficult or expensive to calculate, the Secant method approximates $f'(x_n)$ using the slope between two successive approximations:
$$f'(x_n) \approx \frac{f(x_n) - f(x_{n-1})}{x_n - x_{n-1}}$$

#### Iteration Formula:
$$x_{n+1} = x_n - f(x_n) \cdot \frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}$$

- Requires two initial guesses $x_0$ and $x_1$ (no sign change bracket required).
- **Convergence Rate**: Superlinear ($p = \frac{1 + \sqrt{5}}{2} \approx 1.618$, the Golden Ratio).

---

### 5. Theoretical Convergence Comparison

| Metric                   | Bisection Method                               | Regula Falsi Method                     | Secant Method                                  | Newton–Raphson Method                           |
| :----------------------- | :--------------------------------------------- | :-------------------------------------- | :--------------------------------------------- | :---------------------------------------------- |
| **Category**             | Bracketing $[a, b]$                            | Bracketing $[a, b]$                     | Open (2 initial estimates)                     | Open (1 initial estimate)                       |
| **Order of Convergence** | **Linear ($p = 1$)**                           | **Linear ($p = 1$)**                    | **Superlinear ($p \approx 1.618$)**            | **Local Quadratic ($p = 2$)**                   |
| **Derivative Required?** | No                                             | No                                      | No (finite difference)                         | Yes ($f'(x)$ analytical)                        |
| **Reliability**          | Guaranteed if $f(a) \cdot f(b) < 0$            | Guaranteed if $f(a) \cdot f(b) < 0$     | Can oscillate/diverge                          | Sensitive to $x_0$; can diverge or oscillate    |
| **Function Evaluations** | 1 per step                                     | 1 per step                              | 1 per step                                     | 2 per step ($f(x)$ and $f'(x)$)                 |
| **Best Used For**        | Robust initial localization & safety fallback  | Guaranteed bounds with slope guidance   | Rapid convergence without symbolic derivatives | Ultra-fast local refinement to precision limits |

---

## 💻 Computer Science & Real-World Applications

1. **3D Ray Tracing & Computer Graphics (GPU Shaders)**:
   - In ray tracing (Unreal Engine, Blender Cycles), shooting a ray into a curved surface requires solving $\text{Ray}(t) - \text{Surface}(t) = 0$.
   - Newton–Raphson is implemented directly in GPU fragment shaders for sub-pixel ray-surface intersections.

2. **Continuous Collision Detection (CCD) in Game Engines**:
   - Fast-moving objects can tunnel through geometry between frames.
   - Game engines bracket the impact time using Bisection to guarantee no missed collisions, followed by Secant or Newton refinement.

3. **Machine Learning & Convex Optimization**:
   - Locating loss function minima requires solving $\nabla L(w) = 0$.
   - Newton's method generalizes to multi-dimensional optimization using the Hessian matrix of second partial derivatives.

4. **Fast Hardware Arithmetic (ALU / DSP Microcode)**:
   - Hardware CPUs often lack dedicated division circuitry. Floating-point division and square roots are computed using 2–3 iterations of Newton's method (e.g. Quake Fast Inverse Square Root).

---

## 🛠️ Technology Stack & Architecture

- **React 19 + Vite**: High-performance client-side rendering with instant HMR.
- **Math.js**: Exact symbolic differentiation, mathematical expression parsing, and formula simplification.
- **HTML5 Canvas 2D**: Responsive real-time rendering of mathematical curves, tangent projections, and chord intersections.
- **Lucide React**: Clean SVG UI icons.
- **Zero Backend**: 100% Client-side execution with instantaneous calculation response.

---

## 🚀 Installation & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/riddhampatel/Numroot-visulizer.git
cd "Numroot-visulizer"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

---

## 📄 License & Credits

Distributed under the **MIT License**. Designed and developed by **Riddham Raiyani** for academic demonstration under the Foundation of Mathematics (FM) course curriculum.
