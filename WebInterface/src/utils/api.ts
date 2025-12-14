import { Process, Execute, AlgorithmInfo } from './types';

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL;
const REQUEST_TIMEOUT = 10000; 

export interface ScheduleResponse {
  success: boolean;
  algorithm: string;
  totalProcesses: number;
  executes: Execute[];
  error?: string;
}

export interface ScheduleRequest {
  processes: Process[];
  algorithm: string;  
  quantum?: number;
  nb_priority?: number;
  cpu_usage_limit?: number;
}

export async function scheduleProcesses(
  processes: Process[], 
  algorithmName: string,  
  quantum?: number,
  nbPriority?: number,
  cpuUsageLimit?: number
): Promise<Execute[]> {
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const requestBody: ScheduleRequest = {
      processes,
      algorithm: algorithmName,
      ...(quantum !== undefined && { quantum }),
      ...(nbPriority !== undefined && { nb_priority: nbPriority }),
      ...(cpuUsageLimit !== undefined && { cpu_usage_limit: cpuUsageLimit }),
    };
    
    console.log('Sending request:', requestBody);
    
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
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }

    const data: ScheduleResponse = await response.json();
    console.log('Received response:', data);

    if (!data.success || !data.executes) {
      throw new Error(data.error || 'Invalid server response');
    }

    return data.executes;
    
  } catch (error) {
    console.error('Failed to schedule processes:', error);
    throw error;
  }
}

export async function getServerStatus(): Promise<{
  online: boolean;
  algorithms: AlgorithmInfo[];
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_BASE_URL}/algorithms`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { 
        online: false,
        algorithms: [],
      };
    }

    const data = await response.json();
    return {
      online: true,
      algorithms: data.algorithms || [],
    };
  } catch {
    return { 
      online: false,
      algorithms: [],
    };
  }
}