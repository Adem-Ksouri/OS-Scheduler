# 🧠 OS Scheduler Simulator
A mini operating system scheduler simulation project that implements and compares **FIFO (First In First Out)**, **Round Robin**, **Priority Preemptive**, and **Multilevel Queue** scheduling algorithms.

---

## 🚀 Overview
This project is a simplified simulation of how operating systems manage process scheduling.  
It allows you to observe and analyze the performance of different CPU scheduling algorithms.

### Implemented Algorithms
- 🟢 **FIFO (First In First Out)** — The simplest scheduling method, processes are executed in the order they arrive.
- 🔵 **Round Robin (RR)** — Each process gets a fixed time slice (quantum) before moving to the next.
- 🟠 **Priority Preemptive (PP)** — The CPU is always allocated to the highest-priority ready process; preemption occurs when a higher-priority process arrives.  
- 🟣 **Multilevel Queue (MLQ)** — Processes are divided into multiple queues with different scheduling priorities.

---

## 🧩 Features
- Simulates process execution and CPU time allocation  
- Calculates metrics like:
  - Waiting Time
  - Response Time
- Visual timeline output (Gantt chart-like display)
- Written in clean, well-documented code
