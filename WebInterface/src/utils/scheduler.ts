import { Process, Execute, AlgorithmInfo } from './types';
import { scheduleProcesses, getServerStatus } from './api';

function getAlgorithmNameById(algorithmId: number, algorithms: AlgorithmInfo[]): string {
  const algo = algorithms.find(a => a.id === algorithmId);
  return algo?.name || 'Fifo'; 
}

export async function runScheduler(
  processes: Process[],
  algorithmId: number, 
  quantum: number = 4,
  nbPriority?: number,
  cpuUsageLimit?: number
): Promise<Execute[]> {
  
  try {
    const algorithms = await getAvailableAlgorithms();
    const algorithmName = getAlgorithmNameById(algorithmId, algorithms);
    
    console.log(`Running scheduler with algorithm: ${algorithmName} (ID: ${algorithmId})`);
    
    const executes = await scheduleProcesses(
      processes, 
      algorithmName,  
      quantum,
      nbPriority,
      cpuUsageLimit
    );
    return executes;
  } catch (error) {
    console.error('API call failed, using static fallback data:', error);
    return getStaticFallbackData();
  }
}

function getStaticFallbackData(): Execute[] {
  return [
    {
      p: {
        pid: 1,
        ppid: 0,
        name: 'P1',
        arrival: 0,
        exec_time: 7,
        rem_time: 0,
        cpu_usage: 0,
        priority: 2,
        nbEvents: 2,
        events: [
          { t: 2, comment: 'Calculate A + B' },
          { t: 5, comment: 'Store result in register' },
        ],
      },
      ts: 0,
      te: 7,
      event_count: 2,
      events: [
        { t: 2, comment: 'Calculate A + B' },
        { t: 5, comment: 'Store result in register' },
      ],
    },
    {
      p: {
        pid: 2,
        ppid: 0,
        name: 'P2',
        arrival: 1,
        exec_time: 4,
        rem_time: 0,
        cpu_usage: 0,
        priority: 1,
        nbEvents: 1,
        events: [{ t: 2, comment: 'Perform logical AND' }],
      },
      ts: 7,
      te: 11,
      event_count: 1,
      events: [{ t: 9, comment: 'Perform logical AND' }],
    },
    {
      p: {
        pid: 3,
        ppid: 0,
        name: 'P3',
        arrival: 2,
        exec_time: 8,
        rem_time: 0,
        cpu_usage: 0,
        priority: 3,
        nbEvents: 2,
        events: [
          { t: 3, comment: 'Load data from memory' },
          { t: 6, comment: 'Write to cache' },
        ],
      },
      ts: 11,
      te: 19,
      event_count: 2,
      events: [
        { t: 14, comment: 'Load data from memory' },
        { t: 17, comment: 'Write to cache' },
      ],
    },
    {
      p: {
        pid: 4,
        ppid: 0,
        name: 'P4',
        arrival: 3,
        exec_time: 5,
        rem_time: 0,
        cpu_usage: 0,
        priority: 2,
        nbEvents: 1,
        events: [{ t: 2, comment: 'Multiply operands' }],
      },
      ts: 19,
      te: 24,
      event_count: 1,
      events: [{ t: 21, comment: 'Multiply operands' }],
    },
  ];
}

export async function getAvailableAlgorithms(): Promise<AlgorithmInfo[]> {
  try {
    const status = await getServerStatus();
    
    if (status.online && status.algorithms && status.algorithms.length > 0) {
      return status.algorithms;
    }
    
    return getLocalAlgorithms();
  } catch (error) {
    console.error('Failed to get algorithms from server, using local data:', error);
    return getLocalAlgorithms();
  }
}

function getLocalAlgorithms(): AlgorithmInfo[] {
  return [
    { 
      id: 1, 
      name: 'PreemptivePriority', 
      params: {} 
    },
    { 
      id: 2, 
      name: 'RoundRobin', 
      params: { quantum: true } 
    },
    { 
      id: 3, 
      name: 'Fifo', 
      params: {} 
    },
    { 
      id: 4, 
      name: 'Multilevel', 
      params: { 
        nb_priority: true, 
        cpu_usage_limit: true 
      } 
    },
  ];
}