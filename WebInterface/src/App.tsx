import { useState } from 'react';
import { SetupPanel } from './components/SetupPanel';
import { SimulatorInterface } from './components/SimulatorInterface';
import { Process } from './utils/types';

export default function App() {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithmId, setAlgorithmId] = useState<string>('');
  const [quantum, setQuantum] = useState(4);

  const handleStartSimulation = (
    procs: Process[],
    algoId: string,
    q: number
  ) => {
    setProcesses(procs);
    setAlgorithmId(algoId);
    setQuantum(q);
    setSimulationStarted(true);
  };

  const handleReset = () => {
    setSimulationStarted(false);
    setProcesses([]);
    setAlgorithmId('');
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
          onReset={handleReset}
        />
      )}
    </div>
  );
}