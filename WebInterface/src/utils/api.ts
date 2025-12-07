// API Service for scheduler server communication
import { CPUEvent } from './types';

export interface ServerProcess {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  events: Array<{ time: number; operation: string }>;
}

export interface SchedulerEvent {
  processId: string;
  startTime: number;
  endTime: number;
  eventType: string;
  duration: number;
  processState: {
    remainingTime: number;
    arrivalTime: number;
    burstTime: number;
    priority?: number;
  };
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
  state: 'Not Arrived' | 'Ready' | 'Running' | 'Finished';
  currentEventIndex: number;
  currentEventProgress: number;
  events: CPUEvent[];
}

export interface SchedulerResult {
  timeline: SchedulerEvent[];
  finalStates: ProcessExecutionState[];
  totalTime: number;
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  description: string;
  requiresQuantum: boolean;
}

// Configuration - Update this URL to your actual server endpoint
const API_BASE_URL = 'https://your-scheduler-api.com/api';
const REQUEST_TIMEOUT = 5000; // 5 seconds

/**
 * Fetch available scheduling algorithms from server
 */
export async function fetchAlgorithms(): Promise<AlgorithmInfo[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}/algorithms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response
    if (!Array.isArray(data.algorithms)) {
      throw new Error('Invalid response format');
    }

    return data.algorithms as AlgorithmInfo[];
  } catch (error) {
    console.error('Failed to fetch algorithms from server:', error);
    // Return fallback algorithms
    return getFallbackAlgorithms();
  }
}

/**
 * Execute scheduling algorithm on server
 */
export async function executeScheduling(
  processes: ServerProcess[],
  algorithmId: string,
  quantum?: number
): Promise<SchedulerResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const requestBody = {
      processes,
      algorithm: algorithmId,
      quantum,
    };

    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.timeline || !data.finalStates) {
      throw new Error('Invalid server response format');
    }

    return {
      timeline: data.timeline,
      finalStates: data.finalStates,
      totalTime: data.totalTime || calculateTotalTime(data.timeline),
    };
  } catch (error) {
    console.error('Server scheduling failed:', error);
    throw error; // Throw to trigger fallback
  }
}

/**
 * Calculate total time from timeline
 */
function calculateTotalTime(timeline: SchedulerEvent[]): number {
  if (timeline.length === 0) return 0;
  return Math.max(...timeline.map(e => e.endTime));
}

/**
 * Fallback algorithms when server is unavailable
 */
function getFallbackAlgorithms(): AlgorithmInfo[] {
  return [
    {
      id: 'FCFS',
      name: 'First Come First Served (FCFS)',
      description: 'Processes are executed in the order they arrive',
      requiresQuantum: false,
    },
    {
      id: 'SJF',
      name: 'Shortest Job First (SJF)',
      description: 'Process with shortest burst time is executed first',
      requiresQuantum: false,
    },
    {
      id: 'Priority-Preemptive',
      name: 'Priority Scheduling (Preemptive)',
      description: 'Higher priority processes can preempt lower priority ones',
      requiresQuantum: false,
    },
    {
      id: 'Priority-Non-Preemptive',
      name: 'Priority Scheduling (Non-Preemptive)',
      description: 'Higher priority processes are scheduled first without preemption',
      requiresQuantum: false,
    },
    {
      id: 'Round Robin',
      name: 'Round Robin (RR)',
      description: 'Each process gets a fixed time quantum in circular order',
      requiresQuantum: true,
    },
  ];
}

/**
 * Test server connectivity
 */
export async function testServerConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}