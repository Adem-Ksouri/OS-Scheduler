import { Process, Execute , AlgorithmInfo} from './types';
import React from 'react';


const API_BASE_URL =  import.meta.env.VITE_API_SERVER_URL;


const REQUEST_TIMEOUT = 10000; 

export interface ScheduleResponse {
  executes: Execute[];
  totalTime: number;
  success: boolean;
  error?: string;
}

export interface ScheduleRequest {
  processes: Process[];
  algorithm: string;
  quantum?: number;
  priority_levels?: number;      // ADD THIS
  cpu_usage_limit?: number;      // ADD THIS
}

export async function scheduleProcesses(
  processes: Process[],
  algorithm: string,
  quantum?: number,
  priorityLevels?: number,        // ADD THIS
  cpuUsageLimit?: number          // ADD THIS
): Promise<Execute[]> {
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const requestBody: ScheduleRequest = {
      processes,
      algorithm,
      ...(quantum !== undefined && { quantum }),
      ...(priorityLevels !== undefined && { priority_levels: priorityLevels }),      // ADD THIS
      ...(cpuUsageLimit !== undefined && { cpu_usage_limit: cpuUsageLimit }),        // ADD THIS
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
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data: ScheduleResponse = await response.json();

    if (!data.success || !data.executes) {
      throw new Error(data.error || 'Invalid server response');
    }

    return data.executes;
    
  } catch (error) {
    console.error('Failed to schedule processes:', error);
    throw error;
  }
}


/**
 * Get server status and available algorithms
 */
export async function getServerStatus(): Promise<{
  online: boolean;
  algorithms: AlgorithmInfo[];

}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { online: false ,
        algorithms:[],
       };
    }

    const data = await response.json();
    return {
      online: true,
      algorithms: data.algorithms,
  
    };
  } catch {
    return { online: false  ,
        algorithms:[],
       };
  }
}