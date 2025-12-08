import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Gauge, Clock } from 'lucide-react';
import { AlgorithmInfo } from '../utils/types';
import { getAvailableAlgorithms } from '../utils/scheduler';

interface SimulationControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  currentTime: number;
  onPlayPause: () => void;
  onStep: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  onAlgorithmChange: (algorithmId: string) => void;
  currentAlgorithmId: string;
  quantum?: number;
  onQuantumChange?: (quantum: number) => void;
}

export function SimulationControls({
  isRunning,
  isPaused,
  speed,
  currentTime,
  onPlayPause,
  onStep,
  onRestart,
  onSpeedChange,
  onAlgorithmChange,
  currentAlgorithmId,
  quantum,
  onQuantumChange,
}: SimulationControlsProps) {
  const [algorithms, setAlgorithms] = useState<AlgorithmInfo[]>([]);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      const algos = await getAvailableAlgorithms();
      setAlgorithms(algos);
    };
    fetchAlgorithms();
  }, []);

  const selectedAlgo = algorithms.find(a => a.id === currentAlgorithmId);
  const requiresQuantum = selectedAlgo?.requiresQuantum || false;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-md font-medium ${
              isRunning && !isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
            }`}
            title={isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
          >
            {isRunning && !isPaused ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {isPaused ? 'Resume' : 'Play'}
              </>
            )}
          </button>

          <button
            onClick={onStep}
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors"
            title="Step forward one time unit"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={onRestart}
            className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-colors"
            title="Restart simulation"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="text-xs text-slate-600">Current Time</div>
          <div className="text-sm font-mono font-semibold text-slate-800">{currentTime} units</div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <Gauge className="w-5 h-5 text-slate-600" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-600">Speed</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={speed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-medium text-slate-700 min-w-[40px]">{speed}x</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <select
            value={currentAlgorithmId}
            onChange={(e) => onAlgorithmChange(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
          >
            {algorithms.map(algo => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        {requiresQuantum && onQuantumChange && (
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <Clock className="w-5 h-5 text-orange-600" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-600">Quantum</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="20"
                  step="1"
                  value={quantum}
                  onChange={(e) => onQuantumChange(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-center text-sm bg-white border border-orange-300 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-xs text-slate-600">units</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}