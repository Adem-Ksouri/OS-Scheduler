import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Process, SchedulingAlgorithm } from '../App';
import { SimulationControls } from './SimulationControls';
import { GanttChart } from './GanttChart';
import { ProcessMetrics } from './ProcessMetrics';
import { runScheduler, SchedulerResult } from '../utils/scheduler';

interface SimulatorInterfaceProps {
  processes: Process[];
  algorithm: SchedulingAlgorithm;
  quantum: number;
  onReset: () => void;
}

export interface GanttBlock {
  processId: string;
  startTime: number;
  endTime: number;
  eventType: string;
  color: string;
}

export interface ProcessState {
  id: string;
  state: 'Ready' | 'Running' | 'Waiting' | 'Finished';
  remainingTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  lastExecutionTime: number;
  firstResponseTime: number | null;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  currentEventIndex: number;
  currentEventProgress: number;
  events: Array<{ time: number; operation: string }>;
}

const PROCESS_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // green
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
];

export function SimulatorInterface({
  processes,
  algorithm,
  quantum,
  onReset,
}: SimulatorInterfaceProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [ganttBlocks, setGanttBlocks] = useState<GanttBlock[]>([]);
  const [processStates, setProcessStates] = useState<ProcessState[]>([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(algorithm);
  const [currentQuantum, setCurrentQuantum] = useState(quantum);
  
  const [schedulerResult, setSchedulerResult] = useState<SchedulerResult | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const processColorsRef = useRef<Map<string, string>>(new Map());

  // Initialize process colors
  useEffect(() => {
    processes.forEach((p, index) => {
      if (!processColorsRef.current.has(p.id)) {
        processColorsRef.current.set(p.id, PROCESS_COLORS[index % PROCESS_COLORS.length]);
      }
    });
  }, [processes]);

  // Run scheduler when algorithm or quantum changes
  useEffect(() => {
    const result = runScheduler(processes, currentAlgorithm, currentQuantum);
    setSchedulerResult(result);
    
    // Initialize process states from scheduler result
    setProcessStates(
      result.finalStates.map((s) => ({
        id: s.id,
        state: 'Ready',
        remainingTime: s.burstTime,
        waitingTime: 0,
        turnaroundTime: 0,
        responseTime: 0,
        lastExecutionTime: -1,
        firstResponseTime: null,
        arrivalTime: s.arrivalTime,
        burstTime: s.burstTime,
        priority: s.priority,
        currentEventIndex: 0,
        currentEventProgress: 0,
        events: s.events.map(e => ({ time: e.time, operation: e.operation })),
      }))
    );

    // Reset simulation
    setCurrentTime(0);
    setGanttBlocks([]);
    setIsRunning(false);
    setIsPaused(false);
  }, [processes, currentAlgorithm, currentQuantum]);

  // Animation loop - advance time
  useEffect(() => {
    if (isRunning && !isPaused && schedulerResult) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          // Stop when we reach the end
          if (next > schedulerResult.totalTime) {
            setIsRunning(false);
            return schedulerResult.totalTime;
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
  }, [isRunning, isPaused, speed, schedulerResult]);

  // Update gantt blocks and process states based on current time
  useEffect(() => {
    if (!schedulerResult) return;

    // Filter timeline events up to current time
    const visibleEvents = schedulerResult.timeline.filter(
      e => e.startTime < currentTime
    );

    // Convert to gantt blocks
    const blocks: GanttBlock[] = visibleEvents.map(e => ({
      processId: e.processId,
      startTime: e.startTime,
      endTime: Math.min(e.endTime, currentTime),
      eventType: e.eventType,
      color: processColorsRef.current.get(e.processId) || '#3b82f6',
    }));

    setGanttBlocks(blocks);

    // Update process states based on current time
    setProcessStates(prev => prev.map(state => {
      const eventsForProcess = schedulerResult.timeline.filter(
        e => e.processId === state.id && e.startTime < currentTime
      );

      if (eventsForProcess.length === 0) {
        return {
          ...state,
          state: state.arrivalTime <= currentTime ? 'Ready' : 'Waiting',
        };
      }

      // Calculate metrics up to current time
      const lastEvent = eventsForProcess[eventsForProcess.length - 1];
      const executionTime = eventsForProcess.reduce((sum, e) => {
        const duration = Math.min(e.endTime, currentTime) - e.startTime;
        return sum + duration;
      }, 0);

      const remainingTime = Math.max(0, state.burstTime - executionTime);
      const firstExecution = eventsForProcess[0]?.startTime;
      const responseTime = firstExecution !== undefined ? firstExecution - state.arrivalTime : 0;
      
      let processState: 'Ready' | 'Running' | 'Waiting' | 'Finished' = 'Ready';
      if (remainingTime === 0) {
        processState = 'Finished';
      } else if (lastEvent.endTime > currentTime - 1 && lastEvent.startTime < currentTime) {
        processState = 'Running';
      } else if (state.arrivalTime > currentTime) {
        processState = 'Waiting';
      }

      const waitingTime = currentTime - state.arrivalTime - executionTime;
      const turnaroundTime = remainingTime === 0 ? currentTime - state.arrivalTime : 0;

      return {
        ...state,
        state: processState,
        remainingTime,
        waitingTime: Math.max(0, waitingTime),
        turnaroundTime,
        responseTime,
        firstResponseTime: firstExecution !== undefined ? firstExecution : null,
      };
    }));
  }, [currentTime, schedulerResult]);

  const handlePlayPause = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleStep = () => {
    setCurrentTime((prev) => prev + 1);
  };

  const handleRestart = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentTime(0);
    setGanttBlocks([]);
    setProcessStates(
      processes.map((p) => ({
        id: p.id,
        state: 'Ready',
        remainingTime: p.burstTime,
        waitingTime: 0,
        turnaroundTime: 0,
        responseTime: 0,
        lastExecutionTime: -1,
        firstResponseTime: null,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        priority: p.priority,
        currentEventIndex: 0,
        currentEventProgress: 0,
        events: p.events.map(e => ({ time: e.time, operation: e.operation })),
      }))
    );
  };

  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const cpuUtilization = currentTime > 0 ? ((ganttBlocks.length / currentTime) * 100).toFixed(1) : '0.0';
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 lg:p-6"
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
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
            Algorithm: <span className="text-slate-800">{currentAlgorithm}</span>
            {currentAlgorithm === 'Round Robin' && ` (Quantum: ${currentQuantum})`}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6 mb-6">
          {/* Left: Controls + Gantt Chart */}
          <div className="space-y-6">
            <SimulationControls
              isRunning={isRunning}
              isPaused={isPaused}
              speed={speed}
              currentTime={currentTime}
              onPlayPause={handlePlayPause}
              onStep={handleStep}
              onRestart={handleRestart}
              onSpeedChange={setSpeed}
              onAlgorithmChange={setCurrentAlgorithm}
              currentAlgorithm={currentAlgorithm}
             
              quantum={currentQuantum}
              onQuantumChange={setCurrentQuantum}
            />

            <GanttChart
              ganttBlocks={ganttBlocks}
              currentTime={currentTime}
              processColors={processColorsRef.current}
              processes={processes}
            />
          </div>

          {/* Right: Metrics */}
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