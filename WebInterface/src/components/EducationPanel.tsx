import { motion } from 'motion/react';
import { X, BookOpen, Lightbulb, Zap, Clock } from 'lucide-react';
import { SchedulingAlgorithm } from '../App';

interface EducationPanelProps {
  algorithm: SchedulingAlgorithm;
  onClose: () => void;
}

const algorithmInfo = {
  FCFS: {
    title: 'First Come First Served (FCFS)',
    description:
      'The simplest CPU scheduling algorithm where processes are executed in the order they arrive in the ready queue.',
    pros: [
      'Simple to understand and implement',
      'Fair in terms of arrival order',
      'No starvation - every process gets executed',
    ],
    cons: [
      'High average waiting time (convoy effect)',
      'Not suitable for time-sharing systems',
      'Poor performance with variable burst times',
    ],
    useCase:
      'Best for batch processing systems where all jobs are known in advance and have similar execution times.',
    example: 'If P1 arrives at t=0 (burst=10), P2 at t=1 (burst=5), and P3 at t=2 (burst=3), execution order is: P1 → P2 → P3',
  },
  SJF: {
    title: 'Shortest Job First (SJF/SJN)',
    description:
      'Selects the process with the smallest burst time from the ready queue. Can be preemptive (SRTF) or non-preemptive.',
    pros: [
      'Minimizes average waiting time',
      'Optimal for minimizing average turnaround time',
      'Efficient CPU utilization',
    ],
    cons: [
      'Difficult to predict burst time in advance',
      'Can cause starvation for longer processes',
      'Not practical for interactive systems',
    ],
    useCase:
      'Ideal for batch systems where process execution times are known or can be estimated accurately.',
    example: 'If P1 (burst=8), P2 (burst=4), P3 (burst=2) are ready, execution order is: P3 → P2 → P1',
  },
  'Priority-Preemptive': {
    title: 'Priority Scheduling (Preemptive)',
    description:
      'Each process has a priority level. Higher-priority processes can preempt lower-priority ones that are currently running.',
    pros: [
      'Important tasks get CPU time quickly',
      'Flexible - priorities can reflect business needs',
      'Responsive to critical processes',
    ],
    cons: [
      'Lower-priority processes may starve',
      'Requires careful priority assignment',
      'Overhead from context switching',
    ],
    useCase:
      'Perfect for real-time systems and applications where certain tasks must be prioritized (e.g., OS kernel tasks).',
    example: 'If P1 (priority=3) is running and P2 (priority=1, lower number = higher priority) arrives, P2 preempts P1 immediately.',
  },
  'Priority-Non-Preemptive': {
    title: 'Priority Scheduling (Non-Preemptive)',
    description:
      'Processes are scheduled based on priority, but once a process starts executing, it runs to completion without interruption.',
    pros: [
      'Less context switching overhead',
      'Simpler to implement than preemptive version',
      'Predictable execution for running processes',
    ],
    cons: [
      'Less responsive than preemptive priority',
      'Still susceptible to starvation',
      'High-priority tasks may wait if low-priority process is running',
    ],
    useCase:
      'Suitable for systems where process interruption is costly or where consistency of execution is important.',
    example: 'If P1 (priority=5) starts and P2 (priority=1) arrives, P2 waits until P1 completes, then executes next.',
  },
  'Round Robin': {
    title: 'Round Robin (RR)',
    description:
      'Each process gets a fixed time quantum to execute. After the quantum expires, the process is preempted and moved to the end of the ready queue.',
    pros: [
      'Fair allocation of CPU time',
      'Good response time for interactive systems',
      'No starvation - all processes get turns',
    ],
    cons: [
      'Performance depends heavily on quantum size',
      'Higher context switching overhead',
      'Average waiting time can be high',
    ],
    useCase:
      'Excellent for time-sharing systems, interactive applications, and general-purpose operating systems.',
    example: 'With quantum=4: P1 runs 4 units → P2 runs 4 units → P3 runs 4 units → cycle repeats until all complete.',
  },
};

export function EducationPanel({ algorithm, onClose }: EducationPanelProps) {
  const info = algorithmInfo[algorithm];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 lg:p-8"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl">
            <BookOpen className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-slate-800">Learning Center</h2>
            <p className="text-slate-600">Understanding CPU Scheduling Algorithms</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Algorithm Title */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h3 className="text-slate-800 mb-2">{info.title}</h3>
          <p className="text-slate-600">{info.description}</p>
        </div>

        {/* Grid Layout for Pros/Cons */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-green-600" />
              <h3 className="text-green-800">Advantages</h3>
            </div>
            <ul className="space-y-2">
              {info.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-700">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="text-amber-800">Disadvantages</h3>
            </div>
            <ul className="space-y-2">
              {info.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-700">
                  <span className="text-amber-600 mt-1">!</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Use Case */}
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="text-purple-800">Best Use Case</h3>
          </div>
          <p className="text-slate-700">{info.useCase}</p>
        </div>

        {/* Example */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-slate-800 mb-2">Example Scenario</h3>
          <p className="text-slate-700 font-mono bg-white p-3 rounded-lg border border-slate-200">
            {info.example}
          </p>
        </div>

        {/* Key Concepts */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-blue-800 mb-3">Key Concepts</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-700 mb-1">Waiting Time</div>
              <p className="text-slate-600">Time process spends in ready queue before execution</p>
            </div>
            <div>
              <div className="text-slate-700 mb-1">Turnaround Time</div>
              <p className="text-slate-600">Total time from arrival to completion</p>
            </div>
            <div>
              <div className="text-slate-700 mb-1">Response Time</div>
              <p className="text-slate-600">Time from arrival to first execution</p>
            </div>
            <div>
              <div className="text-slate-700 mb-1">Context Switch</div>
              <p className="text-slate-600">CPU switching from one process to another</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
