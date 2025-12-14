import { useState, useEffect } from 'react';
import { Play, Shuffle, Info } from 'lucide-react';
import { Process, AlgorithmInfo } from '../utils/types';
import { ProcessTable } from './ProcessTable';
import { generateRandomProcesses } from '../utils/processHelpers';
import { getAvailableAlgorithms } from '../utils/scheduler';

interface SetupPanelProps {
  onStartSimulation: (
    processes: Process[],
    algorithmId: number,  
    quantum: number,
    nbPriority: number,
    cpuUsageLimit: number
  ) => void;
}

export function SetupPanel({ onStartSimulation }: SetupPanelProps) {
  const [processes, setProcesses] = useState<Process[]>([
    {
      pid: 1,
      ppid: 0,
      name: 'P1',
      arrival: 0,
      exec_time: 7,
      rem_time: 7,
      cpu_usage: 0,
      priority: 2,
      nbEvents: 2,
      events: [
        { t: 2, comment: 'Calculate A + B' },
        { t: 5, comment: 'Store result in register' },
      ],
    },
    {
      pid: 2,
      ppid: 0,
      name: 'P2',
      arrival: 1,
      exec_time: 4,
      rem_time: 4,
      cpu_usage: 0,
      priority: 1,
      nbEvents: 1,
      events: [
        { t: 2, comment: 'Perform logical AND' },
      ],
    },
    {
      pid: 3,
      ppid: 0,
      name: 'P3',
      arrival: 2,
      exec_time: 8,
      rem_time: 8,
      cpu_usage: 0,
      priority: 3,
      nbEvents: 2,
      events: [
        { t: 3, comment: 'Load data from memory' },
        { t: 6, comment: 'Write to cache' },
      ],
    },
    {
      pid: 4,
      ppid: 0,
      name: 'P4',
      arrival: 3,
      exec_time: 5,
      rem_time: 5,
      cpu_usage: 0,
      priority: 2,
      nbEvents: 1,
      events: [
        { t: 2, comment: 'Multiply operands' },
      ],
    },
  ]);
  
  const [algorithms, setAlgorithms] = useState<AlgorithmInfo[]>([]);
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<number>(1);  
  const [quantum, setQuantum] = useState(4);
  const [isLoadingAlgorithms, setIsLoadingAlgorithms] = useState(true);
  const [nbPriority, setNbPriority] = useState(3);
  const [cpuUsageLimit, setCpuUsageLimit] = useState(2);

useEffect(() => {
  const fetchAlgorithms = async () => {
    setIsLoadingAlgorithms(true);
    const algos = await getAvailableAlgorithms();
    setAlgorithms(algos);
    if (algos.length > 0) {
      const fifoAlgo = algos.find(a => 
        a.name.toLowerCase().includes('fifo') || 
        a.name.toLowerCase().includes('fcfs')
      );
      setSelectedAlgorithmId(fifoAlgo ? fifoAlgo.id : algos[0].id);
    }
    setIsLoadingAlgorithms(false);
  };
  fetchAlgorithms();
}, []);
  const handleGenerateRandom = () => {
    const newProcesses = generateRandomProcesses();
    setProcesses(newProcesses);
  };

  const handleStart = () => {
    if (processes.length === 0) {
      alert('Please add at least one process');
      return;
    }
    if (!selectedAlgorithmId) {
      alert('Please select an algorithm');
      return;
    }
    onStartSimulation(processes, selectedAlgorithmId, quantum, nbPriority, cpuUsageLimit);
  };

  const selectedAlgo = algorithms.find(a => a.id === selectedAlgorithmId);
  const requiresQuantum = selectedAlgo?.params?.quantum || false;
  const requiresMultilevelParams = selectedAlgo?.params?.nb_priority || selectedAlgo?.params?.cpu_usage_limit || false;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            OS Process Scheduler Simulator
          </h1>
          <p className="text-slate-600">
            Configure your processes and scheduling algorithm to begin the interactive simulation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid lg:grid-cols-[1fr,380px] gap-0">
            <div className="p-8 border-r border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-1">Process Configuration</h2>
                  <p className="text-sm text-slate-500">Add and configure processes with CPU events</p>
                </div>
                <button
                  onClick={handleGenerateRandom}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-colors"
                  title="Generate 3-8 random processes with realistic values"
                >
                  <Shuffle className="w-4 h-4" />
                  Generate Random
                </button>
              </div>

              <ProcessTable processes={processes} setProcesses={setProcesses} />
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Algorithm & Settings</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Scheduling Algorithm
                  <span className="ml-1 text-slate-400 cursor-help" title="Select the CPU scheduling algorithm to simulate">
                    <Info className="w-3 h-3 inline" />
                  </span>
                </label>
                {isLoadingAlgorithms ? (
                  <div className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-500">
                    Loading algorithms...
                  </div>
                ) : (
                  <select
                    value={selectedAlgorithmId}
                    onChange={(e) => setSelectedAlgorithmId(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {algorithms.map(algo => (
                      <option key={algo.id} value={algo.id}>
                        {algo.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {requiresQuantum && (
                <div className="mb-6 p-4 bg-blue-100 rounded-xl border border-blue-200">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time Quantum
                    <span className="ml-1 text-slate-400 cursor-help" title="Maximum time slice for each process">
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

              {requiresMultilevelParams && (
                <>
                  <div className="mb-6 p-4 bg-purple-100 rounded-xl border border-purple-200">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority Levels
                      <span className="ml-1 text-slate-400 cursor-help" title="Number of priority queues">
                        <Info className="w-3 h-3 inline" />
                      </span>
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={nbPriority}
                      onChange={(e) => setNbPriority(parseInt(e.target.value) || 3)}
                      className="w-full px-4 py-3 bg-white border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6 p-4 bg-green-100 rounded-xl border border-green-200">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CPU Usage Limit
                      <span className="ml-1 text-slate-400 cursor-help" title="CPU usage threshold for demotion">
                        <Info className="w-3 h-3 inline" />
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={cpuUsageLimit}
                      onChange={(e) => setCpuUsageLimit(parseInt(e.target.value) || 2)}
                      className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleStart}
                  disabled={processes.length === 0 || !selectedAlgorithmId || isLoadingAlgorithms}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
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
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-slate-500">
          <p>Configure processes and click "Start Simulation" to reveal the interactive timeline and metrics</p>
        </div>
      </div>
    </div>
  );
}