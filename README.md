# Interactive Bézier Curve with Physics & Sensor Control
Supports mouse, touch, and optional device orientation input.
## Author
**Abhishek Kumar**  
B.Tech, Indian Institute of Information Technology Guwahati (IIITG)

## Overview
This project implements an interactive cubic Bézier curve that behaves like a springy rope.
The curve dynamically responds to real-time mouse input using a spring-damping physics model.
Tangent vectors are analytically computed and visualized along the curve.

## Mathematics
The cubic Bézier curve is defined as:

B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃

The tangent is computed using the derivative:

B′(t) = 3(1−t)²(P₁−P₀) + 6(1−t)t(P₂−P₁) + 3t²(P₃−P₂)

## Physics Model
The control points P₁ and P₂ follow a spring-damping equation:

acceleration = -k(position − target) − damping × velocity

This creates smooth, natural rope-like motion.

## Features
- Manual Bézier curve implementation
- Real-time tangent visualization
- Spring-based control point motion
- 60 FPS HTML Canvas rendering
- No external libraries used

## Controls
- Move the mouse to interact with the curve.

## Demo
A short screen recording demonstrating interactivity is included.

## Tech Stack
- HTML5 Canvas
- Vanilla JavaScript
