import { Process, CPUEvent } from '../App';

export interface SchedulerEvent {
  processId: string;
  startTime: number;
  endTime: number;
  eventType: 'Compute' | 'ContextSwitch' | 'Preemption' | 'Idle';
  duration: number;
  processState: {
    remainingTime: number;
    arrivalTime: number;
    burstTime: number;
    priority?: number;
  };
  eventIndex?: number;
  eventProgress?: number;
}

export interface ProcessExecutionState {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  completionTime: number;
  firstResponseTime: number | null;
  state: 'Waiting' | 'Ready' | 'Running' | 'Finished';
  currentEventIndex: number;
  currentEventProgress: number;
  events: CPUEvent[];
}

export interface SchedulerResult {
  timeline: SchedulerEvent[];
  finalStates: ProcessExecutionState[];
  totalTime: number;
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

const CONTEXT_SWITCH_TIME = 0;

export function runScheduler(
  processes: Process[],
  algorithm: string,
  quantum: number = 4
): SchedulerResult {
  switch (algorithm) {
    case 'FCFS':
      return runFCFS(processes);
    case 'SJF':
      return runSJF(processes);
    case 'Priority-Preemptive':
      return runPriorityPreemptive(processes);
    case 'Priority-Non-Preemptive':
      return runPriorityNonPreemptive(processes);
    case 'Round Robin':
      return runRoundRobin(processes, quantum);
    default:
      return runFCFS(processes);
  }
}

function runFCFS(processes: Process[]): SchedulerResult {
  const timeline: SchedulerEvent[] = [];
  const states: ProcessExecutionState[] = processes.map(p => ({
    id: p.id,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority,
    remainingTime: p.burstTime,
    waitingTime: 0,
    turnaroundTime: 0,
    responseTime: 0,
    completionTime: 0,
    firstResponseTime: null,
    state: 'Waiting' as const,
    currentEventIndex: 0,
    currentEventProgress: 0,
    events: p.events,
  }));

  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;

  for (const process of sortedProcesses) {
    const state = states.find(s => s.id === process.id)!;

    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    if (state.firstResponseTime === null) {
      state.firstResponseTime = currentTime;
      state.responseTime = currentTime - process.arrivalTime;
    }

    timeline.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
      eventType: 'Compute',
      duration: process.burstTime,
      processState: {
        remainingTime: process.burstTime,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        priority: process.priority,
      },
    });

    currentTime += process.burstTime;
    state.completionTime = currentTime;
    state.turnaroundTime = currentTime - process.arrivalTime;
    state.waitingTime = state.turnaroundTime - process.burstTime;
    state.remainingTime = 0;
    state.state = 'Finished';
  }

  return calculateMetrics(timeline, states, currentTime);
}

function runSJF(processes: Process[]): SchedulerResult {
  const timeline: SchedulerEvent[] = [];
  const states: ProcessExecutionState[] = processes.map(p => ({
    id: p.id,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority,
    remainingTime: p.burstTime,
    waitingTime: 0,
    turnaroundTime: 0,
    responseTime: 0,
    completionTime: 0,
    firstResponseTime: null,
    state: 'Waiting' as const,
    currentEventIndex: 0,
    currentEventProgress: 0,
    events: p.events,
  }));

  let currentTime = 0;
  const completed = new Set<string>();

  while (completed.size < processes.length) {
    const available = processes.filter(
      p => p.arrivalTime <= currentTime && !completed.has(p.id)
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const shortest = available.reduce((min, p) => 
      p.burstTime < min.burstTime ? p : min
    );

    const state = states.find(s => s.id === shortest.id)!;

    if (state.firstResponseTime === null) {
      state.firstResponseTime = currentTime;
      state.responseTime = currentTime - shortest.arrivalTime;
    }

    timeline.push({
      processId: shortest.id,
      startTime: currentTime,
      endTime: currentTime + shortest.burstTime,
      eventType: 'Compute',
      duration: shortest.burstTime,
      processState: {
        remainingTime: shortest.burstTime,
        arrivalTime: shortest.arrivalTime,
        burstTime: shortest.burstTime,
        priority: shortest.priority,
      },
    });

    currentTime += shortest.burstTime;
    state.completionTime = currentTime;
    state.turnaroundTime = currentTime - shortest.arrivalTime;
    state.waitingTime = state.turnaroundTime - shortest.burstTime;
    state.remainingTime = 0;
    state.state = 'Finished';
    completed.add(shortest.id);
  }

  return calculateMetrics(timeline, states, currentTime);
}

function runPriorityPreemptive(processes: Process[]): SchedulerResult {
  const timeline: SchedulerEvent[] = [];
  const states: ProcessExecutionState[] = processes.map(p => ({
    id: p.id,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority,
    remainingTime: p.burstTime,
    waitingTime: 0,
    turnaroundTime: 0,
    responseTime: 0,
    completionTime: 0,
    firstResponseTime: null,
    state: 'Waiting' as const,
    currentEventIndex: 0,
    currentEventProgress: 0,
    events: p.events,
  }));

  let currentTime = 0;
  let lastProcess: string | null = null;
  const maxTime = Math.max(...processes.map(p => p.arrivalTime + p.burstTime)) * 2;

  while (currentTime < maxTime && states.some(s => s.remainingTime > 0)) {
    const available = states.filter(
      s => s.arrivalTime <= currentTime && s.remainingTime > 0
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const highest = available.reduce((max, s) =>
      (s.priority || 999) < (max.priority || 999) ? s : max
    );

    if (highest.firstResponseTime === null) {
      highest.firstResponseTime = currentTime;
      highest.responseTime = currentTime - highest.arrivalTime;
    }

    if (lastProcess && lastProcess !== highest.id) {
      timeline.push({
        processId: 'CONTEXT_SWITCH',
        startTime: currentTime,
        endTime: currentTime + CONTEXT_SWITCH_TIME,
        eventType: 'ContextSwitch',
        duration: CONTEXT_SWITCH_TIME,
        processState: {
          remainingTime: 0,
          arrivalTime: 0,
          burstTime: 0,
        },
      });
      currentTime += CONTEXT_SWITCH_TIME;
    }

    timeline.push({
      processId: highest.id,
      startTime: currentTime,
      endTime: currentTime + 1,
      eventType: 'Compute',
      duration: 1,
      processState: {
        remainingTime: highest.remainingTime,
        arrivalTime: highest.arrivalTime,
        burstTime: highest.burstTime,
        priority: highest.priority,
      },
    });

    highest.remainingTime--;
    currentTime++;
    lastProcess = highest.id;

    if (highest.remainingTime === 0) {
      highest.completionTime = currentTime;
      highest.turnaroundTime = currentTime - highest.arrivalTime;
      highest.waitingTime = highest.turnaroundTime - highest.burstTime;
      highest.state = 'Finished';
    }
  }

  return calculateMetrics(timeline, states, currentTime);
}

function runPriorityNonPreemptive(processes: Process[]): SchedulerResult {
  const timeline: SchedulerEvent[] = [];
  const states: ProcessExecutionState[] = processes.map(p => ({
    id: p.id,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority,
    remainingTime: p.burstTime,
    waitingTime: 0,
    turnaroundTime: 0,
    responseTime: 0,
    completionTime: 0,
    firstResponseTime: null,
    state: 'Waiting' as const,
    currentEventIndex: 0,
    currentEventProgress: 0,
    events: p.events,
  }));

  let currentTime = 0;
  const completed = new Set<string>();

  while (completed.size < processes.length) {
    const available = states.filter(
      s => s.arrivalTime <= currentTime && !completed.has(s.id)
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const highest = available.reduce((max, s) =>
      (s.priority || 999) < (max.priority || 999) ? s : max
    );

    if (highest.firstResponseTime === null) {
      highest.firstResponseTime = currentTime;
      highest.responseTime = currentTime - highest.arrivalTime;
    }

    timeline.push({
      processId: highest.id,
      startTime: currentTime,
      endTime: currentTime + highest.burstTime,
      eventType: 'Compute',
      duration: highest.burstTime,
      processState: {
        remainingTime: highest.burstTime,
        arrivalTime: highest.arrivalTime,
        burstTime: highest.burstTime,
        priority: highest.priority,
      },
    });

    currentTime += highest.burstTime;
    highest.completionTime = currentTime;
    highest.turnaroundTime = currentTime - highest.arrivalTime;
    highest.waitingTime = highest.turnaroundTime - highest.burstTime;
    highest.remainingTime = 0;
    highest.state = 'Finished';
    completed.add(highest.id);
  }

  return calculateMetrics(timeline, states, currentTime);
}

function runRoundRobin(processes: Process[], quantum: number): SchedulerResult {
  const timeline: SchedulerEvent[] = [];
  const states: ProcessExecutionState[] = processes.map(p => ({
    id: p.id,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority,
    remainingTime: p.burstTime,
    waitingTime: 0,
    turnaroundTime: 0,
    responseTime: 0,
    completionTime: 0,
    firstResponseTime: null,
    state: 'Waiting' as const,
    currentEventIndex: 0,
    currentEventProgress: 0,
    events: p.events,
  }));

  let currentTime = 0;
  const queue: ProcessExecutionState[] = [];
  const sortedProcesses = [...states].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let processIndex = 0;

  while (queue.length > 0 || processIndex < sortedProcesses.length || states.some(s => s.remainingTime > 0)) {
    while (processIndex < sortedProcesses.length && sortedProcesses[processIndex].arrivalTime <= currentTime) {
      if (sortedProcesses[processIndex].remainingTime > 0 && !queue.includes(sortedProcesses[processIndex])) {
        queue.push(sortedProcesses[processIndex]);
      }
      processIndex++;
    }

    if (queue.length === 0) {
      currentTime++;
      continue;
    }

    const current = queue.shift()!;

    if (current.firstResponseTime === null) {
      current.firstResponseTime = currentTime;
      current.responseTime = currentTime - current.arrivalTime;
    }

    const executeTime = Math.min(quantum, current.remainingTime);

    timeline.push({
      processId: current.id,
      startTime: currentTime,
      endTime: currentTime + executeTime,
      eventType: 'Compute',
      duration: executeTime,
      processState: {
        remainingTime: current.remainingTime,
        arrivalTime: current.arrivalTime,
        burstTime: current.burstTime,
        priority: current.priority,
      },
    });

    current.remainingTime -= executeTime;
    currentTime += executeTime;

    while (processIndex < sortedProcesses.length && sortedProcesses[processIndex].arrivalTime <= currentTime) {
      if (sortedProcesses[processIndex].remainingTime > 0 && !queue.includes(sortedProcesses[processIndex])) {
        queue.push(sortedProcesses[processIndex]);
      }
      processIndex++;
    }

    if (current.remainingTime > 0) {
      queue.push(current);
    } else {
      current.completionTime = currentTime;
      current.turnaroundTime = currentTime - current.arrivalTime;
      current.waitingTime = current.turnaroundTime - current.burstTime;
      current.state = 'Finished';
    }
  }

  return calculateMetrics(timeline, states, currentTime);
}

function calculateMetrics(
  timeline: SchedulerEvent[],
  states: ProcessExecutionState[],
  totalTime: number
): SchedulerResult {
  const completedStates = states.filter(s => s.state === 'Finished');
  
  const avgWaitingTime = completedStates.length > 0
    ? completedStates.reduce((sum, s) => sum + s.waitingTime, 0) / completedStates.length
    : 0;

  const avgTurnaroundTime = completedStates.length > 0
    ? completedStates.reduce((sum, s) => sum + s.turnaroundTime, 0) / completedStates.length
    : 0;

  const avgResponseTime = completedStates.length > 0
    ? completedStates.reduce((sum, s) => sum + s.responseTime, 0) / completedStates.length
    : 0;

  const cpuBusyTime = timeline.reduce((sum, e) => 
    e.eventType === 'Compute' ? sum + e.duration : sum, 0
  );
  
  const cpuUtilization = totalTime > 0 ? (cpuBusyTime / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? completedStates.length / totalTime : 0;

  return {
    timeline,
    finalStates: states,
    totalTime,
    averageWaitingTime: avgWaitingTime,
    averageTurnaroundTime: avgTurnaroundTime,
    averageResponseTime: avgResponseTime,
    cpuUtilization,
    throughput,
  };
}
