#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include "../../Include/Utils.h"

execute* pp_scheduler(process* processes, int n, int *out_cnt) {
    qsort(processes, n, sizeof(process), compare_process); 
    
    int currTime = 0;
    int completed = 0;
    int sz = 0;
    execute* result = NULL;
    
    while(completed < n) {
        int idx = -1;
        int mxPriority = -__INT_MAX__;
        
        for(int i = 0; i < n; i++) {
            if(processes[i].rem_time > 0 && processes[i].arrival <= currTime && processes[i].priority > mxPriority) {
                idx = i;
                mxPriority = processes[i].priority;
            }
        }
        
        if(idx == -1) {
            for(int i = 0; i < n; i++) {
                if(processes[i].rem_time > 0) {
                    currTime = processes[i].arrival;
                    break;
                }
            }
            continue;
        }
        
        int run_time = processes[idx].rem_time;
        int next_preemption = currTime + run_time;
        
        for(int i = 0; i < n; i++) {
            if(processes[i].rem_time > 0 && 
               processes[i].arrival > currTime && 
               processes[i].arrival < next_preemption &&
               processes[i].priority > mxPriority) {
                next_preemption = processes[i].arrival;
                run_time = next_preemption - currTime;
            }
        }
        int ts = currTime;
        int te = currTime + run_time;
        int offset = processes[idx].exec_time - processes[idx].rem_time;
        int cnte;
        event* current_events = getEvents(processes[idx], offset, offset + run_time, &cnte);
        
        for (int i = 0; i < cnte; i++) {
            current_events[i].t = ts + (current_events[i].t - offset);
        }
        
        sz++;
        result = realloc(result, sz * sizeof(execute));
        result[sz-1] = *make_execute(&processes[idx], ts, te, cnte, current_events);
        
     
        processes[idx].rem_time -= run_time;
        currTime = te;
        
        if(processes[idx].rem_time == 0) {
            completed++;
        }
    }
    
    *out_cnt = sz;
    return result;
}