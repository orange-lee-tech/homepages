---
title: "Eight Weeks at IMP: From Particle-Transport Study to Engineering Verification"
date: 2026-08-28
---

<p class="post-lede">From July 6 to August 28, 2026, I completed an eight-week research internship at the Institute of Modern Physics, Chinese Academy of Sciences. The work combined Monte Carlo particle-transport study, engineering-simulation software practice, and thermal analysis around an engineering problem.</p>

## Learning the structure behind particle transport

My internship report plan began with fundamentals rather than software buttons: random sampling, probability distributions, expectation estimation, statistical error, sample size, and why Monte Carlo methods are suitable for particle transport.

I also reviewed interaction cross sections, mean free path, scattering, absorption, energy deposition, sources, materials, geometry, and tally concepts.

The goal was not to claim that I had already built a complete transport code, but to understand the computational logic behind such programs.

## Putting simulation into an engineering context

A second track focused on engineering software, including Ansys/Fluent installation, configuration, basic operation, and case-based learning.

For thermal analysis related to muon transport engineering, I organized boundary conditions, operating cases, and verification parameters, built and ran ANSYS Fluent models, and used a supercomputing cluster for calculations.

The important lesson was that simulation does not end when a solver returns a result.

I had to ask whether the boundary conditions represented the problem, whether operating cases were comparable, whether parameter changes remained consistent, and whether the result could support a safety-margin judgment.

The verified parameter sets showed adequate safety margins under the studied conditions.

## An operations-oriented mental model

This was a research internship, not production operations experience. Still, it created a useful mental bridge:

> **Operating case → boundary → abnormal state → verification → safety margin.**

A model matters because it supports an engineering judgment. A detailed contour plot is not useful if the boundary conditions are wrong, and a single nominal case cannot explain how a system behaves under abnormal conditions.

That reasoning is transferable to energy systems, thermal-fluid equipment, and engineering operations.

## What remains unfinished

The internship also made the next learning steps clearer: stronger mathematics, better programming, deeper particle-transport theory, more complete thermal-fluid simulation cases, and better understanding of uncertainty, convergence, verification, and validation.

The eight weeks ended on August 28, but the learning path did not. The habit I want to keep is simple: define the operating condition first, understand the model boundary second, verify the result, and only then decide what it means for the real system.
