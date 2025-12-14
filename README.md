# OS Process Scheduler Simulator

A comprehensive, interactive web-based operating system scheduler simulator with real-time visualization of CPU scheduling algorithms. This project features a C backend with HTTP API server and a modern React frontend with animated Gantt charts and process state tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20macOS-lightgrey.svg)
![C](https://img.shields.io/badge/C-99-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Algorithms](#-algorithms)
- [API](#-api)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [License](#-license)

---

## 🎯 Features

- **4 Scheduling Algorithms**: FIFO, Round Robin, Preemptive Priority, Multilevel Queue
- **Real-time Visualization**: Animated Gantt charts showing process execution
- **Interactive UI**: Add/edit processes, adjust parameters on-the-fly
- **Performance Metrics**: CPU utilization, turnaround time, waiting time, response time
- **CPU Event Tracking**: Visual markers for internal CPU operations

---

## 🏗️ Architecture

### System Overview

The simulator consists of two main components:

**Backend (C)**
- Implements scheduling algorithms
- HTTP API server using libmicrohttpd
- JSON processing with json-c library
- Process queue management and execution simulation

**Frontend (React + TypeScript)**
- Interactive process configuration interface
- Real-time Gantt chart visualization
- Performance metrics dashboard
- Algorithm parameter controls
<img src="assets/architecture%20diagrame.png" alt="Architecture Diagram" width="500">


---

## 🚀 Quick Start

### Prerequisites
```bash
# Ubuntu/Debian
sudo apt-get install gcc make libmicrohttpd-dev libjson-c-dev

# Node.js 18+ and npm
node --version  # Should be 18+
```

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd os-scheduler-simulator

# Build backend
cd Src
make

# Setup frontend
cd ../WebInterface
npm install
```

### Run
**Terminal 1 - Backend:**
```bash
cd Src
make run
# Server starts on http://localhost:8080
```

**Terminal 2 - Frontend:**
```bash
cd WebInterface
npm run dev
# Open http://localhost:3000
```

---

## 📖 Usage

### Web Interface
1. **Configure Processes**: Add processes with arrival time, execution time, priority
2. **Add CPU Events**: Define internal operations at specific execution times
3. **Select Algorithm**: Choose from FIFO, Round Robin, Priority, or Multilevel (requested from the server to get available ones)
4. **Adjust Parameters**: Set quantum (RR) or priority levels (Multilevel)
5. **Run Simulation**: Click Play to see animated execution
6. **View Metrics**: Monitor real-time statistics and process states

### Alternative Usage Method

#### Interactive Mode (Original)
```bash
cd Src
make run-original

# Follow on-screen prompts to:
# 1. Choose scheduling algorithm
# 2. Enter parameters (if required)
# 3. View results

## Interactive Mode Architecture

<p align="center">
  <img src="assets/cliversion.png" alt="Interactive Mode Architecture" width="500">
</p>



```

---

## 📊 Algorithms

### 1. FIFO (First-In-First-Out)
- Executes processes in arrival order
- No preemption

### 2. Round Robin
- Time-sharing with fixed quantum
- **Parameter**: `quantum` (time slice per process)
- Fair CPU distribution

### 3. Preemptive Priority
- Executes highest priority first
- Preempts lower priority processes
- Risk of starvation for low priority

### 4. Multilevel Queue
- Multiple priority queues with aging; processes with the same priority are in the same queue 
- Higher queues always execute before lower queues
- For the highest priority queue we apply SRT to determine which process will be executed
- If a process exceeds its CPU limit, its priority will decrease
- **Parameters**: 
  - `cpu_limit`: CPU usage before demotion
  - `nb_priority`: Number of priority levels
- Prevents starvation through queue demotion

---

## 🔌 API

### Get Algorithms
```http
GET http://localhost:8080/api/algorithms
```
Returns available algorithms from the server

### Schedule Processes
```http
POST http://localhost:8080/api/schedule
Content-Type: application/json

{
  "algorithm": "RoundRobin",
  "quantum": 4,
  "processes": [
    {
      "name": "P1",
      "arrival": 0,
      "exec_time": 7,
      "priority": 2,
      "events": [
        { "t": 2, "comment": "Calculate A + B" }
      ]
    }
  ]
}
```

---

## ⚙️ Configuration

### Process Config File Format
```text
# name arrival exec_time priority nbEvents [event_time event_comment ...]
P1 0 7 2 2 2 Calculate 5 Store
P2 1 4 1 1 2 Load_data
P3 2 8 3 0
```

---

## 🧪 Testing

### Backend Tests
```bash
cd UnitTests
make test
```

---

## 📄 License

MIT License - see LICENSE file for details

---

**⭐ Star this repo if you find it helpful!**