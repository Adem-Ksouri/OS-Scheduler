import { motion } from 'motion/react';
import { ProcessState } from './SimulatorInterface';
import { Activity, Clock, Zap, TrendingUp, BarChart3, Timer } from 'lucide-react';

interface ProcessMetricsProps {
  processStates: ProcessState[];
  cpuUtilization: string;
  throughput: string;
  avgWaitingTime: string;
  avgTurnaroundTime: string;
  avgResponseTime: string;
}

const stateColors = {
  Ready: 'bg-blue-100 text-blue-700 border-blue-300',
  Running: 'bg-green-100 text-green-700 border-green-300',
  Waiting: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Finished: 'bg-slate-100 text-slate-600 border-slate-300',
};

export function ProcessMetrics({
  processStates,
  cpuUtilization,
  throughput,
  avgWaitingTime,
  avgTurnaroundTime,
  avgResponseTime,
}: ProcessMetricsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
      >
        <h2 className="text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          System Metrics
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-slate-600">CPU Utilization</span>
            </div>
            <div className="text-slate-800">{cpuUtilization}%</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-slate-600">Throughput</span>
            </div>
            <div className="text-slate-800">{throughput}</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-slate-600">Avg Wait</span>
            </div>
            <div className="text-slate-800">{avgWaitingTime}</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span className="text-slate-600">Avg TAT</span>
            </div>
            <div className="text-slate-800">{avgTurnaroundTime}</div>
          </div>

          <div className="col-span-2 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-600">Avg Response Time</span>
            </div>
            <div className="text-slate-800">{avgResponseTime}</div>
          </div>
        </div>
      </motion.div>

      {/* Process State Table */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 overflow-hidden"
      >
        <h2 className="text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          Live Process States
        </h2>

        <div className="overflow-y-auto max-h-[500px] space-y-3">
          {processStates.map((process, index) => (
            <motion.div
              key={process.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                process.state === 'Running'
                  ? 'bg-green-50 border-green-300 ring-2 ring-green-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-slate-800">{process.id}</div>
                  <span
                    className={`px-3 py-1 rounded-full border text-xs ${
                      stateColors[process.state]
                    }`}
                  >
                    {process.state}
                  </span>
                </div>
                <div className="text-slate-600">
                  Remaining: {process.remainingTime}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-600">
                  <span className="opacity-70">Arrival:</span> {process.arrivalTime}
                </div>
                <div className="text-slate-600">
                  <span className="opacity-70">Burst:</span> {process.burstTime}
                </div>
                {process.priority !== undefined && (
                  <div className="text-slate-600">
                    <span className="opacity-70">Priority:</span> {process.priority}
                  </div>
                )}
                <div className="text-slate-600">
                  <span className="opacity-70">Wait:</span> {process.waitingTime}
                </div>
              </div>

              {process.state === 'Finished' && (
                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-600">
                    <span className="opacity-70">TAT:</span> {process.turnaroundTime}
                  </div>
                  <div className="text-slate-600">
                    <span className="opacity-70">Response:</span> {process.responseTime}
                  </div>
                </div>
              )}

              {/* Progress bar for remaining time */}
              {process.state !== 'Finished' && (
                <div className="mt-3">
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{
                        width: `${(process.remainingTime / process.burstTime) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`h-full rounded-full ${
                        process.state === 'Running'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
      >
        <h2 className="text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Computed Metrics
        </h2>

        <div className="space-y-4">
          {processStates
            .filter((p) => p.state === 'Finished')
            .map((process) => (
              <div
                key={process.id}
                className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200"
              >
                <div className="text-slate-700 mb-2">{process.id}</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-slate-500">Wait Time</div>
                    <div className="text-slate-800">{process.waitingTime}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">TAT</div>
                    <div className="text-slate-800">{process.turnaroundTime}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Response</div>
                    <div className="text-slate-800">{process.responseTime}</div>
                  </div>
                </div>
              </div>
            ))}

          {processStates.filter((p) => p.state === 'Finished').length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Detailed metrics will appear as processes complete</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
