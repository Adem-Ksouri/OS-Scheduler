import { Process, Execute } from './types';
import * as API from './api';

/**
 * Main scheduler function with server-first approach
 * Falls back to local computation if server fails
 */
export async function runScheduler(
  processes: Process[],
  algorithmId: string,
  quantum: number = 4
): Promise<Execute[]> {
  // Try server first
  try {
    console.log('Attempting to use server for scheduling...');
    const executes = await API.executeScheduling(processes, algorithmId, quantum);
    console.log('✓ Using server-computed schedule');
    return executes;
  } catch (error) {
    console.warn('Server scheduling failed, using local fallback:', error);
  }

  // Fallback to local computation
  console.log('✓ Using local scheduling computation');
  return runSchedulerLocal(processes, algorithmId, quantum);
}

/**
 * Local scheduler implementation (fallback)
 */
function runSchedulerLocal(
  processes: Process[],
  algorithmId: string,
  quantum: number = 4
): Execute[] {
  switch (algorithmId) {
    case 'FCFS':
      return runFCFS(processes);
    case 'SJF':
      return runSJF(processes);
    case 'Priority-Preemptive':
      return runPriorityPreemptive(processes);
    case 'Priority-Non-Preemptive':
      return runPriorityNonPreemptive(processes);
    case 'RR':
      return runRoundRobin(processes, quantum);
    default:
      console.warn(`Unknown algorithm: ${algorithmId}, falling back to FCFS`);
      return runFCFS(processes);
  }
}

// ============================================================================
// Local Algorithm Implementations
// ============================================================================

function runFCFS(processes: Process[]): Execute[] {
  const executes: Execute[] = [];
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
  let currentTime = 0;

  for (const p of sorted) {
    if (currentTime < p.arrival) {
      currentTime = p.arrival;
    }

    executes.push({
      p: { ...p },
      ts: currentTime,
      te: currentTime + p.exec_time,
      events: p.events,
    });

    currentTime += p.exec_time;
  }

  return executes;
}

function runSJF(processes: Process[]): Execute[] {
  const executes: Execute[] = [];
  let currentTime = 0;
  const completed = new Set<number>();
  const processCopies = processes.map(p => ({ ...p }));

  while (completed.size < processes.length) {
    const available = processCopies.filter(
      p => p.arrival <= currentTime && !completed.has(p.pid)
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const shortest = available.reduce((min, p) => 
      p.exec_time < min.exec_time ? p : min
    );

    executes.push({
      p: { ...shortest },
      ts: currentTime,
      te: currentTime + shortest.exec_time,
      events: shortest.events,
    });

    currentTime += shortest.exec_time;
    completed.add(shortest.pid);
  }

  return executes;
}

function runPriorityPreemptive(processes: Process[]): Execute[] {
  const executes: Execute[] = [];
  const states = processes.map(p => ({ ...p, rem_time: p.exec_time }));
  let currentTime = 0;
  const maxTime = Math.max(...processes.map(p => p.arrival + p.exec_time)) * 2;

  while (currentTime < maxTime && states.some(s => s.rem_time > 0)) {
    const available = states.filter(
      s => s.arrival <= currentTime && s.rem_time > 0
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const highest = available.reduce((max, s) =>
      s.priority < max.priority ? s : max
    );

    executes.push({
      p: { ...highest },
      ts: currentTime,
      te: currentTime + 1,
      events: highest.events,
    });

    highest.rem_time--;
    currentTime++;
  }

  return executes;
}

function runPriorityNonPreemptive(processes: Process[]): Execute[] {
  const executes: Execute[] = [];
  let currentTime = 0;
  const completed = new Set<number>();
  const processCopies = processes.map(p => ({ ...p }));

  while (completed.size < processes.length) {
    const available = processCopies.filter(
      p => p.arrival <= currentTime && !completed.has(p.pid)
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const highest = available.reduce((max, p) =>
      p.priority < max.priority ? p : max
    );

    executes.push({
      p: { ...highest },
      ts: currentTime,
      te: currentTime + highest.exec_time,
      events: highest.events,
    });

    currentTime += highest.exec_time;
    completed.add(highest.pid);
  }

  return executes;
}

function runRoundRobin(processes: Process[], quantum: number): Execute[] {
  const executes: Execute[] = [];
  const states = processes.map(p => ({ ...p, rem_time: p.exec_time }));
  let currentTime = 0;
  const queue: typeof states = [];
  const sorted = [...states].sort((a, b) => a.arrival - b.arrival);
  let processIndex = 0;

  while (queue.length > 0 || processIndex < sorted.length || states.some(s => s.rem_time > 0)) {
    while (processIndex < sorted.length && sorted[processIndex].arrival <= currentTime) {
      if (sorted[processIndex].rem_time > 0 && !queue.includes(sorted[processIndex])) {
        queue.push(sorted[processIndex]);
      }
      processIndex++;
    }

    if (queue.length === 0) {
      currentTime++;
      continue;
    }

    const current = queue.shift()!;
    const executeTime = Math.min(quantum, current.rem_time);

    executes.push({
      p: { ...current },
      ts: currentTime,
      te: currentTime + executeTime,
      events: current.events,
    });

    current.rem_time -= executeTime;
    currentTime += executeTime;

    while (processIndex < sorted.length && sorted[processIndex].arrival <= currentTime) {
      if (sorted[processIndex].rem_time > 0 && !queue.includes(sorted[processIndex])) {
        queue.push(sorted[processIndex]);
      }
      processIndex++;
    }

    if (current.rem_time > 0) {
      queue.push(current);
    }
  }

  return executes;
}