import { useState } from 'react';
import { SetupPanel } from './components/SetupPanel';
import { SimulatorInterface } from './components/SimulatorInterface';

export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime: number;
  events: CPUEvent[];
}

export interface CPUEvent {
  time: number; 
  operation: string; 
}

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'Priority-Preemptive' | 'Priority-Non-Preemptive' | 'Round Robin';

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
  speed: number;
}

export default function App() {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [quantum, setQuantum] = useState(4);

  const handleStartSimulation = (
    procs: Process[],
    algo: SchedulingAlgorithm,
    q: number
  ) => {
    setProcesses(procs);
    setAlgorithm(algo);
    setQuantum(q);
    setSimulationStarted(true);
  };

  const handleReset = () => {
    setSimulationStarted(false);
    setProcesses([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {!simulationStarted ? (
        <SetupPanel onStartSimulation={handleStartSimulation} />
      ) : (
        <SimulatorInterface
          processes={processes}
          algorithm={algorithm}
          quantum={quantum}
          onReset={handleReset}
        />
      )}
    </div>
  );
}