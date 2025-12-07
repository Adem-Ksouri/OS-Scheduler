import { Process, ProcessState, CPUEvent } from './types';
import { CPU_OPERATIONS } from './constants';

/**
 * Initialize process states from process list
 */
export function initializeProcessStates(processes: Process[]): ProcessState[] {
  return processes.map((p) => ({
    ...p,
    state: 'Not Arrived' as const,
    waitingTime: 0,
    turnaroundTime: 0,
    responseTime: 0,
    completionTime: 0,
    firstResponseTime: null,
  }));
}

/**
 * Generate random CPU events for a process
 */
export function generateRandomEvents(exec_time: number): CPUEvent[] {
  if (exec_time < 1) return [];
  
  const eventCount = Math.floor(Math.random() * Math.min(exec_time - 1, 4)) + 1;
  const events: CPUEvent[] = [];
  const usedTimes = new Set<number>();
  
  for (let i = 0; i < eventCount; i++) {
    let t: number;
    let attempts = 0;
    
    // Try to find a unique time that's not at the very end
    do {
      t = Math.floor(Math.random() * (exec_time - 1)) + 1;
      attempts++;
    } while (usedTimes.has(t) && attempts < 10);
    
    if (!usedTimes.has(t)) {
      usedTimes.add(t);
      const comment = CPU_OPERATIONS[Math.floor(Math.random() * CPU_OPERATIONS.length)];
      events.push({ t, comment });
    }
  }
  
  return events.sort((a, b) => a.t - b.t);
}

/**
 * Generate random processes for simulation
 */
export function generateRandomProcesses(count?: number): Process[] {
  const processCount = count || Math.floor(Math.random() * 6) + 3;
  const newProcesses: Process[] = [];

  for (let i = 0; i < processCount; i++) {
    const exec_time = Math.floor(Math.random() * 10) + 2;
    const events = generateRandomEvents(exec_time);

    newProcesses.push({
      pid: i + 1,
      ppid: 0,
      name: `P${i + 1}`,
      arrival: Math.floor(Math.random() * 5),
      exec_time,
      rem_time: exec_time,
      priority: Math.floor(Math.random() * 5) + 1,
      nbEvents: events.length,
      events,
    });
  }

  return newProcesses.sort((a, b) => a.arrival - b.arrival);
}