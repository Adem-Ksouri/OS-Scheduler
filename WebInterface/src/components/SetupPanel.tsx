import { useState } from 'react';
import { Play, Plus, Shuffle, Info } from 'lucide-react';
import { Process, SchedulingAlgorithm } from '../App';
import { ProcessTable } from './ProcessTable';

interface SetupPanelProps {
  onStartSimulation: (
    processes: Process[],
    algorithm: SchedulingAlgorithm,
    quantum: number
  ) => void;
}

// Random CPU operations for realistic event generation
const CPU_OPERATIONS = [
  'Calculate A + B',
  'Store result in register',
  'Load data from memory',
  'Perform logical AND',
  'Execute bitwise shift',
  'Compare values',
  'Jump to address',
  'Push to stack',
  'Pop from stack',
  'Increment counter',
  'Decode instruction',
  'Fetch operand',
  'Write to cache',
  'Read from buffer',
  'Set flag bit',
  'Clear register',
  'Multiply operands',
  'Divide numbers',
  'Calculate checksum',
  'Update program counter',
  'Save context',
  'Load instruction',
  'Validate input',
  'Format output',
  'Allocate memory',
];

function generateRandomEvents(burstTime: number): any[] {
  const eventCount = Math.floor(Math.random() * Math.min(burstTime, 4)) + 1; // 1-4 events
  const events: any[] = [];
  
  for (let i = 0; i < eventCount; i++) {
    // Random time within the burst time
    const time = Math.floor(Math.random() * (burstTime - 1)) + 1;
    const operation = CPU_OPERATIONS[Math.floor(Math.random() * CPU_OPERATIONS.length)];
    events.push({ time, operation });
  }
  
  // Sort events by time
  return events.sort((a, b) => a.time - b.time);
}

export function SetupPanel({ onStartSimulation }: SetupPanelProps) {
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: 'P1',
      arrivalTime: 0,
      burstTime: 7,
      priority: 2,
      remainingTime: 7,
      events: [
        { time: 2, operation: 'Calculate A + B' },
        { time: 5, operation: 'Store result in register' },
      ],
    },
    {
      id: 'P2',
      arrivalTime: 1,
      burstTime: 4,
      priority: 1,
      remainingTime: 4,
      events: [
        { time: 2, operation: 'Perform logical AND' },
      ],
    },
    {
      id: 'P3',
      arrivalTime: 2,
      burstTime: 8,
      priority: 3,
      remainingTime: 8,
      events: [
        { time: 3, operation: 'Load data from memory' },
        { time: 6, operation: 'Write to cache' },
      ],
    },
    {
      id: 'P4',
      arrivalTime: 3,
      burstTime: 5,
      priority: 2,
      remainingTime: 5,
      events: [
        { time: 2, operation: 'Multiply operands' },
      ],
    },
  ]);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [quantum, setQuantum] = useState(4);

  const generateRandomProcesses = () => {
    const count = Math.floor(Math.random() * 6) + 3; // 3-8 processes
    const newProcesses: Process[] = [];

    for (let i = 0; i < count; i++) {
      const burst = Math.floor(Math.random() * 10) + 2;
      const events = generateRandomEvents(burst);

      newProcesses.push({
        id: `P${i + 1}`,
        arrivalTime: Math.floor(Math.random() * 5),
        burstTime: burst,
        priority: Math.floor(Math.random() * 5) + 1,
        remainingTime: burst,
        events,
      });
    }

    setProcesses(newProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime));
  };

  const handleStart = () => {
    if (processes.length === 0) {
      alert('Please add at least one process');
      return;
    }
    onStartSimulation(processes, algorithm, quantum);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-slate-800 mb-2">
            OS Process Scheduler Simulator
          </h1>
          <p className="text-slate-600">
            Configure your processes and scheduling algorithm to begin the interactive simulation
          </p>
        </div>

        {/* Main Setup Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid lg:grid-cols-[1fr,380px] gap-0">
            {/* Left: Process Configuration */}
            <div className="p-8 border-r border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-slate-800 mb-1">Process Configuration</h2>
                  <p className="text-slate-500">Add and configure processes with CPU events</p>
                </div>
                <button
                  onClick={generateRandomProcesses}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-colors"
                  title="Generate 3-8 random processes with realistic values"
                >
                  <Shuffle className="w-4 h-4" />
                  Generate Random
                </button>
              </div>

              <ProcessTable processes={processes} setProcesses={setProcesses} />
            </div>

            {/* Right: Algorithm & Settings */}
            <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
              <h2 className="text-slate-800 mb-6">Algorithm & Settings</h2>

              {/* Algorithm Selection */}
              <div className="mb-6">
                <label className="block text-slate-700 mb-2">
                  Scheduling Algorithm
                  <span className="ml-1 text-slate-400 cursor-help" title="Select the CPU scheduling algorithm to simulate">
                    <Info className="w-3 h-3 inline" />
                  </span>
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as SchedulingAlgorithm)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="FCFS">First Come First Served (FCFS)</option>
                  <option value="SJF">Shortest Job First (SJF/SJN)</option>
                  <option value="Priority-Preemptive">Priority Scheduling (Preemptive)</option>
                  <option value="Priority-Non-Preemptive">Priority Scheduling (Non-Preemptive)</option>
                  <option value="Round Robin">Round Robin (RR)</option>
                </select>
              </div>

              {/* Quantum Time (for Round Robin) */}
              {algorithm === 'Round Robin' && (
                <div className="mb-6 p-4 bg-blue-100 rounded-xl border border-blue-200">
                  <label className="block text-slate-700 mb-2">
                    Time Quantum
                    <span className="ml-1 text-slate-400 cursor-help" title="Maximum time slice for each process in Round Robin scheduling">
                      <Info className="w-3 h-3 inline" />
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={quantum}
                    onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Algorithm Info Box */}
              <div className="mb-6 p-4 bg-slate-100 rounded-xl border border-slate-200">
                <h3 className="text-slate-700 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Algorithm Info
                </h3>
                <p className="text-slate-600">
                  {algorithm === 'FCFS' && 'Processes are executed in the order they arrive. Non-preemptive.'}
                  {algorithm === 'SJF' && 'Selects the process with the shortest burst time. Can be preemptive or non-preemptive.'}
                  {algorithm === 'Priority-Preemptive' && 'Processes are scheduled based on priority. Higher priority can interrupt lower priority.'}
                  {algorithm === 'Priority-Non-Preemptive' && 'Processes are scheduled based on priority. No interruption once started.'}
                  {algorithm === 'Round Robin' && 'Each process gets a fixed time quantum. Circular queue implementation.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleStart}
                  disabled={processes.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  Start Simulation
                </button>

                <button
                  onClick={() => setProcesses([])}
                  className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors"
                >
                  Clear All Processes
                </button>
              </div>

              {/* Process Count Info */}
              <div className="mt-6 p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-slate-600">
                  {processes.length} {processes.length === 1 ? 'process' : 'processes'} configured
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-slate-500">
          <p>Configure processes and click "Start Simulation" to reveal the interactive timeline and metrics</p>
        </div>
      </div>
    </div>
  );
}