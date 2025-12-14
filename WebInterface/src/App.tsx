import { useState } from 'react';
import { SetupPanel } from './components/SetupPanel';
import { SimulatorInterface } from './components/SimulatorInterface';
import { Process } from './utils/types';

export default function App() {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithmId, setAlgorithmId] = useState<number>(1); 
  const [quantum, setQuantum] = useState(4);
  const [nbPriority, setNbPriority] = useState(3);
  const [cpuUsageLimit, setCpuUsageLimit] = useState(2);

  const handleStartSimulation = (
    procs: Process[],
    algoId: number, 
    q: number,
    nbPrio: number,
    cpuLimit: number
  ) => {
    setProcesses(procs);
    setAlgorithmId(algoId);
    setQuantum(q);
    setNbPriority(nbPrio);
    setCpuUsageLimit(cpuLimit);
    setSimulationStarted(true);
  };

  const handleReset = () => {
    setSimulationStarted(false);
    setProcesses([]);
    setAlgorithmId(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {!simulationStarted ? (
        <SetupPanel onStartSimulation={handleStartSimulation} />
      ) : (
        <SimulatorInterface
          processes={processes}
          algorithmId={algorithmId}
          quantum={quantum}
          nbPriority={nbPriority}
          cpuUsageLimit={cpuUsageLimit}
          onReset={handleReset}
        />
      )}
    </div>
  );
}