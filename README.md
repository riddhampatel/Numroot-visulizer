# NumRoot Visualizer — Numerical Methods & Root-Finding Simulator

> **Course:** Foundation of Mathematics (FM)  
> **Unit:** Unit 2 — Numerical Methods  
> **Topic:** Interactive Non-Linear Equation Root-Finding & Convergence Analysis in Computing  
> **Methods Covered:** Bisection Method & Newton–Raphson Method  

An interactive, high-performance web simulator demonstrating how mathematical root-finding algorithms solve non-linear equations in computer science. Built with **React**, **Vite**, and **Math.js** for 100% client-side execution with zero backend latency.

---

## 📋 Table of Contents
1. [Project Overview & Objectives](#-project-overview--objectives)
2. [Mathematical Theory & Formulations](#-mathematical-theory--formulations)
   * [Bisection Method](#1-the-bisection-method-bracket-based)
   * [Newton–Raphson Method](#2-the-newtonraphson-method-open-tangent-based)
   * [Theoretical Convergence Comparison](#3-theoretical-convergence-comparison)
3. [Computer Science & Real-World Applications](#-computer-science--real-world-applications)
4. [Key Features & Capabilities](#-key-features--capabilities)
5. [Edge-Case Safeguards & Numerical Stability](#-edge-case-safeguards--numerical-stability)
6. [Technology Stack & Architecture](#-technology-stack--architecture)
7. [Installation & Local Setup](#-installation--local-setup)
8. [Deployment Guide (Vercel)](#-deployment-guide-vercel)
9. [Faculty Email Submission Template](#-faculty-email-submission-template)

---

## 🎯 Project Overview & Objectives

In computer software, analytical closed-form solutions rarely exist for complex engineering equations. Software systems instead rely on numerical algorithms to approximate solutions to arbitrary precision.

### Core Objectives:
* **Interactive Visualization**: Graph continuous non-linear functions $f(x)$ with dynamic interval brackets and tangent line descents.
* **Algorithmic Comparison**: Directly compare bracket-based linear convergence ($p = 1$) against open tangent-based quadratic convergence ($p = 2$).
* **Practical Computer Science Link**: Demonstrate how algorithms like Bisection and Newton–Raphson power real-world 3D graphics shaders, game physics engines, and machine learning optimizations.
* **Data Reproducibility**: Provide full iteration tables with error tracking and instant CSV data export.

---

## 📐 Mathematical Theory & Formulations

### 1. The Bisection Method (Bracket-Based)
The Bisection method is based on the **Intermediate Value Theorem (IVT)**:
> If a continuous function $f(x)$ changes sign over an interval $[a, b]$ such that $f(a) \cdot f(b) < 0$, then there exists at least one real root $c \in (a, b)$ where $f(c) = 0$.

#### Algorithm Steps:
1. Verify $f(a) \cdot f(b) < 0$. If $f(a) = 0$ or $f(b) = 0$, an exact boundary root is identified.
2. Compute the midpoint:
   $$c_k = \frac{a_k + b_k}{2}$$
3. Evaluate $f(c_k)$:
   * If $|f(c_k)| < \text{tolerance}$ or $\frac{|b_k - a_k|}{2} < \text{tolerance}$, stop.
   * If $f(a_k) \cdot f(c_k) < 0$, the root lies in the left half: set $b_{k+1} = c_k$.
   * Otherwise, the root lies in the right half: set $a_{k+1} = c_k$.
4. **Convergence Rate**: Guaranteed Linear ($p = 1$). The maximum error strictly halves with each iteration:
   $$|e_k| \le \frac{b_0 - a_0}{2^k}$$

---

### 2. The Newton–Raphson Method (Open Tangent-Based)
Derived from the **Taylor Series expansion** truncated after the first derivative term:
$$f(x_{k+1}) \approx f(x_k) + f'(x_k)(x_{k+1} - x_k) = 0$$

Solving for $x_{k+1}$ gives the standard iteration formula:
$$x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)}$$

#### Algorithm Steps:
1. Select an initial guess $x_0$.
2. Evaluate $f(x_k)$ and the derivative $f'(x_k)$.
3. Check for division by zero: if $|f'(x_k)| < 10^{-12}$, the tangent is horizontal and the method halts.
4. Calculate $x_{k+1}$.
5. Calculate absolute error $|x_{k+1} - x_k|$ and relative error $\%$.
6. Stop when $|x_{k+1} - x_k| < \text{tolerance}$ or $|f(x_{k+1})| < \text{tolerance}$.
7. **Convergence Rate**: Local Quadratic ($p = 2$) near a simple root under suitable conditions:
   $$|e_{k+1}| \approx C \cdot |e_k|^2$$
   The number of correct decimal places approximately doubles in each step.

---

### 3. Theoretical Convergence Comparison

| Metric | Bisection Method | Newton–Raphson Method |
| :--- | :--- | :--- |
| **Type** | Bracketing method (requires 2 initial values $[a, b]$) | Open method (requires 1 initial guess $x_0$) |
| **Convergence Order** | **Linear ($p = 1$)** | **Local Quadratic ($p = 2$)** |
| **Reliability** | Guaranteed to converge if $f(a) \cdot f(b) < 0$ | Sensitive to $x_0$; can diverge or oscillate |
| **Derivative Required?** | No | Yes ($f'(x)$) |
| **Function Evaluations** | 1 evaluation per step ($f(c)$) | 2 evaluations per step ($f(x_k)$ and $f'(x_k)$) |
| **Best Used For** | Robust initial localization & safety fallbacks | Rapid local refinement to ultra-high precision |

---

## 💻 Computer Science & Real-World Applications

1. **3D Ray Tracing & Computer Graphics (GPU Shaders)**:
   * In photorealistic graphics (Unreal Engine, Blender Cycles), shooting a light ray into a curved implicit surface requires finding the surface intersection point:
     $$\text{Ray}(t) - \text{Surface}(t) = 0$$
   * Newton–Raphson is written in GLSL/HLSL fragment shaders to solve surface roots in real-time per pixel.

2. **Continuous Collision Detection (CCD) in Game Engines**:
   * Fast-moving objects (bullets, vehicles) can "tunnel" through walls in discrete timesteps.
   * Physics engines formulate contact time as $f(t_{\text{impact}}) = 0$. Bisection brackets the time window to guarantee no missed collisions, followed by Newton refinement.

3. **Machine Learning & Convex Optimization**:
   * Finding optimal model parameters requires locating points where the loss function gradient vanishes:
     $$\nabla L(w) = 0$$
   * Newton–Raphson generalizes into **Newton’s Optimization Method** using the Hessian matrix of second derivatives, converging in far fewer steps than standard Gradient Descent.

4. **Fast Hardware Arithmetic (ALU / DSP Microcode)**:
   * Hardware CPUs lack dedicated division circuits. Floating-point division ($1/D$) and square roots ($1/\sqrt{x}$) are calculated using 2–3 iterations of Newton's method (e.g., the Quake Fast Inverse Square Root).

---

## ✨ Key Features & Capabilities

* **Pre-loaded Textbook & Exam Presets**: One-click test cases:
  * Polynomial: $x^3 - x - 2 = 0$
  * Transcendental: $\cos(x) - x = 0$ (Dottie number)
  * Cubic Exam Problem: $x^3 - 4x - 9 = 0$
  * Exponential: $e^{-x} - x = 0$
  * Square Root ($\sqrt{5}$): $x^2 - 5 = 0$
* **Custom Equation Parser**: Real-time syntax parsing supporting natural notation like `4x`, `ln(x)`, `e^x`, and `(x-1)(x+2)`.
* **Interactive Step-by-Step Playback**:
  * Play, Pause, Next Step, Previous Step, and Step Slider ($k = 1 \dots N$).
  * Shows interval narrowing (Bisection) and tangent slope projections (Newton–Raphson).
* **Interactive Canvas Navigation**:
  * **Drag to Pan**: Freely drag around the graph with your mouse.
  * **Zoom In / Zoom Out**: Dynamic viewport scaling.
* **Error Convergence Chart**: Logarithmic scale chart ($\log_{10}(\text{Error})$ vs. $k$) demonstrating quadratic decay versus linear decay.
* **Iteration Data Tables**:
  * Clean mathematical notation ($a_k, b_k, c_k, x_k, x_{k+1}$).
  * Interactive row highlighting synced with the graph canvas.
* **Data Export**: One-click **Export CSV** for both methods.

---

## 🛡️ Edge-Case Safeguards & Numerical Stability

* **Intermediate Value Theorem Guard**: Detects if $f(a) \cdot f(b) > 0$ and informs the user that the bracketing condition is violated.
* **Boundary Root Detection**: Detects if $a$ or $b$ is already an exact root ($|f(a)| < 10^{-14}$).
* **Zero-Slope Protection**: Halts safely if the derivative $|f'(x)| < 10^{-12}$, preventing divide-by-zero exceptions.
* **Non-Finite & Divergence Guard**: Automatically catches non-finite values (`NaN`, $\infty$) and stops if $|x| > 10^9$.

---

## 🛠️ Technology Stack & Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **React 19 + Vite** | Fast client-side rendering with Hot Module Replacement |
| **Math Engine** | **Math.js** | Safe expression compilation and analytical differentiation |
| **Styling** | **Custom CSS Design System** | Glassmorphism, deep dark theme, responsive flex/grid layouts |
| **Canvas** | **HTML5 Canvas 2D API** | High-DPI mathematical rendering with custom grid and tangent lines |
| **Icons** | **Lucide React** | Consistent SVG icons |
| **Database / Backend** | **None** | 100% Client-Side for instant zero-lag evaluation |

---

## 🚀 Installation & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* npm (comes with Node.js)

### Quick Start
```bash
# 1. Clone or open the project directory
cd "maths asignment"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open **`http://localhost:5175/`** in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment Guide (Vercel)

Because this application is 100% client-side with no backend or database required, it can be deployed to Vercel in 2 minutes:

1. Push your code to a **GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of NumRoot Visualizer"
   git branch -M main
   git remote add origin https://github.com/[your-username]/[your-repo-name].git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **"Deploy"**. Your live URL will be ready in under 60 seconds.

---

## ✉️ Faculty Email Submission Template

When submitting your assignment, use this pre-formatted email structure:

```text
Subject: Innovative Assignment – FM – Numerical Methods – [Your Name] – [Your Division]

Respected Faculty,

Please find the details for my Innovative Assignment for Foundation of Mathematics (FM):

• Name: [Your Full Name]
• Enrolment Number: [Your Enrolment Number]
• Programme: [e.g. BCA / B.Tech / MCA / MSc-IT]
• Semester & Division: Semester [X], Division [Y]
• Chosen Unit: Unit 2 – Numerical Methods
• Assignment Title: Interactive Numerical Root-Finding & Convergence Visualizer

Live Working Application: https://[your-project-name].vercel.app
GitHub Repository: https://github.com/[your-username]/[your-repo-name]

Summary of the Work:
1. Objective: Built an interactive web simulator comparing bracket-based (Bisection) and open (Newton-Raphson) root-finding algorithms for non-linear equations.
2. Mathematical Concepts: Intermediate Value Theorem, Taylor series linear approximation, error bounds, and convergence orders (Linear p=1 vs Local Quadratic p=2).
3. Computer Science Application: Numerical root-finding is essential in 3D computer graphics (ray-surface intersection in shaders), physics engines (continuous collision detection), and gradient optimization in machine learning.
4. Numerical Stability: Implemented edge-case protections against zero slopes f'(x) ≈ 0, non-finite outputs, and IVT violations.

Thank you.

Sincerely,
[Your Full Name]
[Your Enrolment Number]
```

---

## 📄 License
This project is open-source and created for academic demonstration under the Foundation of Mathematics course curriculum.
