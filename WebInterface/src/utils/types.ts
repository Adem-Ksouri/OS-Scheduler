// Types matching C server structures

export interface CPUEvent {
  t: number;          // after t seconds of execution
  comment: string;    // operation description
}

export interface Process {
  pid: number;
  ppid: number;
  name: string;
  arrival: number;
  exec_time: number;
  rem_time: number;
  priority: number;
  nbEvents: number;
  events: CPUEvent[];
}

export interface Execute {
  p: Process;
  ts: number;       // start time
  te: number;       // end time
  events: CPUEvent[];
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  requiresQuantum: boolean;
}

export interface ProcessState extends Process {
  state: 'Ready' | 'Running' | 'Not Arrived' | 'Finished';
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  firstResponseTime: number | null;
  completionTime: number;
}

export interface GanttBlock {
  pid: number;
  name: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
  speed: number;
}