import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Gauge, Clock, Layers, Cpu } from 'lucide-react';
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
  priorityLevels?: number;
  cpuUsageLimit?: number;
  onPriorityLevelsChange?: (levels: number) => void;
  onCpuUsageLimitChange?: (limit: number) => void;
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
  priorityLevels,
  cpuUsageLimit,
  onPriorityLevelsChange,
  onCpuUsageLimitChange,
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
  const requiresMultilevelParams = selectedAlgo?.requiresMultilevelParams || false;

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

        <div className="flex items-center gap-3 px-4 h-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 min-w-[160px]">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Time</span>
            <span className="text-sm font-mono font-semibold text-slate-800">{currentTime}</span>
            <span className="text-sm text-slate-600">units</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 h-12 bg-slate-50 rounded-xl border border-slate-200 min-w-[160px]">
          <Gauge className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Speed</span>
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="w-16 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-medium text-slate-700">{speed}x</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 h-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 min-w-[180px]">
          <select
            value={currentAlgorithmId}
            onChange={(e) => onAlgorithmChange(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer flex-1"
          >
            {algorithms.map(algo => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        {requiresQuantum && onQuantumChange && (
          <div className="flex items-center gap-3 px-4 h-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 min-w-[180px]">
            <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Quantum</span>
              <input
                type="number"
                min="1"
                max="20"
                step="1"
                value={quantum}
                onChange={(e) => onQuantumChange(parseInt(e.target.value) || 1)}
                className="w-14 px-2 py-1 text-center text-sm bg-white border border-orange-300 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-600">units</span>
            </div>
          </div>
        )}
        
        {requiresMultilevelParams && onPriorityLevelsChange && onCpuUsageLimitChange && (
          <>
            <div className="flex items-center gap-3 px-4 h-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 min-w-[180px]">
              <Layers className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Levels</span>
                <input
                  type="number"
                  min="2"
                  max="10"
                  step="1"
                  value={priorityLevels}
                  onChange={(e) => onPriorityLevelsChange(parseInt(e.target.value) || 3)}
                  className="w-14 px-2 py-1 text-center text-sm bg-white border border-purple-300 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 h-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 min-w-[180px]">
              <Cpu className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">CPU Limit</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={cpuUsageLimit}
                  onChange={(e) => onCpuUsageLimitChange(parseInt(e.target.value) || 2)}
                  className="w-14 px-2 py-1 text-center text-sm bg-white border border-green-300 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}