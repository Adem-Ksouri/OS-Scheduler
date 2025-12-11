#include <stdio.h>
#include <stdlib.h>
#include "../../Include/Scheduler.h"

execute* fifo_scheduler(process* processes, int n, int* out_count) {
    qsort(processes, n, sizeof(process), compare_process);
    execute* result = (execute*)malloc(n * sizeof(execute));
    if (!result) return NULL;
    
    int ts = 0;
    for (int i = 0; i < n; i++) {
        if (ts < processes[i].arrival)
            ts = processes[i].arrival;
        
        int te = ts + processes[i].exec_time;
        
        int event_count = 0;
        // Get events for the entire process execution (offset 0 to exec_time)
        event* filtered_events = getEvents(processes[i], 0, processes[i].exec_time, &event_count);
        
        // Convert event times from process-relative to wall-clock time
        for (int j = 0; j < event_count; j++) {
            filtered_events[j].t = ts + filtered_events[j].t;
        }
        
        result[i].p = make_process(&processes[i]);
        result[i].ts = ts;
        result[i].te = te;
        result[i].event_count = event_count;
        result[i].events = filtered_events;
        
        ts = te;
    }
    
    *out_count = n;
    return result;
}