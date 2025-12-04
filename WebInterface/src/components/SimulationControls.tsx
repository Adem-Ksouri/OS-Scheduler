import { Play, Pause, SkipForward, RotateCcw, Gauge, BookOpen, Zap, Clock } from 'lucide-react';
import { SchedulingAlgorithm } from '../App';

interface SimulationControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  currentTime: number;
  onPlayPause: () => void;
  onStep: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void;
  currentAlgorithm: SchedulingAlgorithm;
  onToggleEducation: () => void;
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
  currentAlgorithm,
  onToggleEducation,
  quantum,
  onQuantumChange,
}: SimulationControlsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-md ${
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

        {/* Time Display */}
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="text-slate-600">Current Time</div>
          <div className="text-slate-800">{currentTime} units</div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <Gauge className="w-5 h-5 text-slate-600" />
          <div className="flex flex-col">
            <span className="text-slate-600">Speed</span>
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
              <span className="text-slate-700 min-w-[40px]">{speed}x</span>
            </div>
          </div>
        </div>

        {/* Algorithm Switch */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <Zap className="w-5 h-5 text-indigo-600" />
          <select
            value={currentAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as SchedulingAlgorithm)}
            className="bg-transparent text-slate-700 outline-none cursor-pointer"
          >
            <option value="FCFS">FCFS</option>
            <option value="SJF">SJF</option>
            <option value="Priority-Preemptive">Priority (Pre)</option>
            <option value="Priority-Non-Preemptive">Priority (Non-Pre)</option>
            <option value="Round Robin">Round Robin</option>
          </select>
        </div>

        {/* Quantum Control */}
        {currentAlgorithm === 'Round Robin' && onQuantumChange && (
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <Clock className="w-5 h-5 text-orange-600" />
            <div className="flex flex-col">
              <span className="text-slate-600">Quantum</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="20"
                  step="1"
                  value={quantum}
                  onChange={(e) => onQuantumChange(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-center bg-white border border-orange-300 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-slate-600">units</span>
              </div>
            </div>
          </div>
        )}

        {/* Education Toggle */}
        <button
          onClick={onToggleEducation}
          className="flex items-center gap-2 px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-xl transition-colors ml-auto"
          title="Toggle educational information"
        >
          <BookOpen className="w-5 h-5" />
          Learn
        </button>
      </div>
    </div>
  );
}