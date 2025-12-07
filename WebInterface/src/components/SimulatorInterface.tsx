import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Process, Execute, GanttBlock, ProcessState } from '../utils/types';
import { SimulationControls } from './SimulationControls';
import { GanttChart } from './GanttChart';
import { ProcessMetrics } from './ProcessMetrics';
import { runScheduler } from '../utils/scheduler';
import { PROCESS_COLORS } from '../utils/constants';
import { initializeProcessStates } from '../utils/processHelpers';
import { fetchAlgorithms } from '../utils/api';

interface SimulatorInterfaceProps {
  processes: Process[];
  algorithmId: string;
  quantum: number;
  onReset: () => void;
}

export function SimulatorInterface({
  processes,
  algorithmId,
  quantum,
  onReset,
}: SimulatorInterfaceProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [ganttBlocks, setGanttBlocks] = useState<GanttBlock[]>([]);
  const [processStates, setProcessStates] = useState<ProcessState[]>([]);
  const [currentAlgorithmId, setCurrentAlgorithmId] = useState(algorithmId);
  const [currentQuantum, setCurrentQuantum] = useState(quantum);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [algorithmName, setAlgorithmName] = useState<string>('');
  
  const [executes, setExecutes] = useState<Execute[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const processColorsRef = useRef<Map<number, string>>(new Map());

  // Initialize process colors
  useEffect(() => {
    processes.forEach((p, index) => {
      if (!processColorsRef.current.has(p.pid)) {
        processColorsRef.current.set(p.pid, PROCESS_COLORS[index % PROCESS_COLORS.length]);
      }
    });
  }, [processes]);

  // Fetch algorithm name
  useEffect(() => {
    const loadAlgorithmName = async () => {
      const algorithms = await fetchAlgorithms();
      const algo = algorithms.find(a => a.id === currentAlgorithmId);
      setAlgorithmName(algo?.name || currentAlgorithmId);
    };
    loadAlgorithmName();
  }, [currentAlgorithmId]);

  // Run scheduler when algorithm or quantum changes
  useEffect(() => {
    let cancelled = false;
    
    const runAsync = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await runScheduler(processes, currentAlgorithmId, currentQuantum);
        
        if (!cancelled) {
          setExecutes(result);
          const maxTime = result.length > 0 ? Math.max(...result.map(e => e.te)) : 0;
          setTotalTime(maxTime);
          
          // Initialize process states
          setProcessStates(initializeProcessStates(processes));

          // Reset simulation
          setCurrentTime(0);
          setGanttBlocks([]);
          setIsRunning(false);
          setIsPaused(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to compute schedule. Please try again.');
          console.error('Scheduler error:', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    
    runAsync();
    return () => {
      cancelled = true;
    };
  }, [processes, currentAlgorithmId, currentQuantum]);

  // Animation loop
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next > totalTime) {
            setIsRunning(false);
            return totalTime;
          }
          return next;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, speed, totalTime]);

  // Update gantt blocks and process states based on current time
  useEffect(() => {
    if (executes.length === 0) return;

    const visibleExecutes = executes.filter(e => e.ts < currentTime);

    const blocks: GanttBlock[] = visibleExecutes.map(e => ({
      pid: e.p.pid,
      name: e.p.name,
      startTime: e.ts,
      endTime: Math.min(e.te, currentTime),
      color: processColorsRef.current.get(e.p.pid) || '#3b82f6',
    }));

    setGanttBlocks(blocks);

    // Update process states
    setProcessStates(prev => prev.map(state => {
      const processExecutes = executes.filter(
        e => e.p.pid === state.pid && e.ts < currentTime
      );

      if (processExecutes.length === 0) {
        return {
          ...state,
          state: state.arrival <= currentTime ? 'Ready' : 'Not Arrived',
        };
      }

      const lastExecute = processExecutes[processExecutes.length - 1];
      const totalExecuted = processExecutes.reduce((sum, e) => {
        const duration = Math.min(e.te, currentTime) - e.ts;
        return sum + duration;
      }, 0);

      const remainingTime = Math.max(0, state.exec_time - totalExecuted);
      const firstExecution = processExecutes[0]?.ts;
      const responseTime = firstExecution !== undefined ? firstExecution - state.arrival : 0;
      
      let processState: 'Ready' | 'Running' | 'Not Arrived' | 'Finished' = 'Ready';
      if (remainingTime === 0) {
        processState = 'Finished';
      } else if (lastExecute.te > currentTime - 1 && lastExecute.ts < currentTime) {
        processState = 'Running';
      } else if (state.arrival > currentTime) {
        processState = 'Not Arrived';
      }

      const waitingTime = currentTime - state.arrival - totalExecuted;
      const turnaroundTime = remainingTime === 0 ? currentTime - state.arrival : 0;

      return {
        ...state,
        state: processState,
        rem_time: remainingTime,
        waitingTime: Math.max(0, waitingTime),
        turnaroundTime,
        responseTime,
        firstResponseTime: firstExecution !== undefined ? firstExecution : null,
        completionTime: remainingTime === 0 ? currentTime : 0,
      };
    }));
  }, [currentTime, executes]);

  const handlePlayPause = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleStep = () => {
    setCurrentTime((prev) => Math.min(prev + 1, totalTime));
  };

  const handleRestart = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentTime(0);
    setGanttBlocks([]);
    setProcessStates(initializeProcessStates(processes));
  };

  const cpuUtilization = currentTime > 0 
    ? ((ganttBlocks.reduce((sum, b) => sum + (b.endTime - b.startTime), 0) / currentTime) * 100).toFixed(1)
    : '0.0';
  const completedProcesses = processStates.filter((p) => p.state === 'Finished').length;
  const throughput = currentTime > 0 ? (completedProcesses / currentTime).toFixed(3) : '0.000';

  const avgWaitingTime =
    processStates.length > 0
      ? (processStates.reduce((sum, p) => sum + p.waitingTime, 0) / processStates.length).toFixed(2)
      : '0.00';

  const avgTurnaroundTime =
    completedProcesses > 0
      ? (
          processStates
            .filter((p) => p.state === 'Finished')
            .reduce((sum, p) => sum + p.turnaroundTime, 0) / completedProcesses
        ).toFixed(2)
      : '0.00';

  const avgResponseTime =
    processStates.filter((p) => p.firstResponseTime !== null).length > 0
      ? (
          processStates
            .filter((p) => p.firstResponseTime !== null)
            .reduce((sum, p) => sum + p.responseTime, 0) /
          processStates.filter((p) => p.firstResponseTime !== null).length
        ).toFixed(2)
      : '0.00';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Computing schedule...</p>
          <p className="text-slate-400 text-sm mt-2">Trying server, will fallback to local if needed</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 lg:p-6 w-full"
    >
      {/* Main container with max-width constraint */}
      <div className="max-w-[2000px] mx-auto">
        
        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-slate-800">OS Process Scheduler Simulator</h1>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors"
            >
              Back to Setup
            </button>
          </div>
          <p className="text-slate-600">
            Algorithm: <span className="text-slate-800">{algorithmName}</span>
            {currentAlgorithmId === 'RR' && ` (Quantum: ${currentQuantum})`}
          </p>
        </div>

        {/* Main content grid - LEFT: Charts, RIGHT: Metrics */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6 mb-6">
          
          {/* LEFT COLUMN - Charts with scroll containment */}
          <div className="space-y-6 min-w-0 overflow-hidden">
            
            {/* Simulation Controls */}
            <SimulationControls
              isRunning={isRunning}
              isPaused={isPaused}
              speed={speed}
              currentTime={currentTime}
              onPlayPause={handlePlayPause}
              onStep={handleStep}
              onRestart={handleRestart}
              onSpeedChange={setSpeed}
              onAlgorithmChange={setCurrentAlgorithmId}
              currentAlgorithmId={currentAlgorithmId}
              quantum={currentQuantum}
              onQuantumChange={setCurrentQuantum}
            />

            {/* Gantt Chart - with overflow containment */}
            <GanttChart
              ganttBlocks={ganttBlocks}
              currentTime={currentTime}
              processColors={processColorsRef.current}
              processes={processes}
              executes={executes}
            />
          </div>

          {/* RIGHT COLUMN - Metrics sidebar */}
          <ProcessMetrics
            processStates={processStates}
            cpuUtilization={cpuUtilization}
            throughput={throughput}
            avgWaitingTime={avgWaitingTime}
            avgTurnaroundTime={avgTurnaroundTime}
            avgResponseTime={avgResponseTime}
          />
        </div>
      </div>
    </motion.div>
  );
}