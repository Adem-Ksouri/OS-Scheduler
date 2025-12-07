#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include "../../Include/Utils.h"

execute* pp_scheduler(process* processes, int n, int *out_cnt) {
    qsort(processes, n, sizeof(process), compare_process); 
    execute* result = NULL;
    bool ok[n];
    memset(ok,false,sizeof(ok));
    int currTime = 0,currIdx = -1,completed = 0,sz=0;
    while(completed<n){
        int idx=-1,mxPriority = -__INT_MAX__;
        for(int i=0;i<n;i++){
            if(!ok[i] && processes[i].arrival < currTime && processes[i].priority>mxPriority){
                idx=i;
                mxPriority = processes[i].priority;
            }
        }
        //when all processes with arrival < currTime have completed 
        //then we will assign the first process that comes the first and have the max priority
        if(idx == -1){
            for(int i=0;i<n;i++){
                if(!ok[i]){
                    idx = i;
                    break;
                }
            }
        }
        //when there is no process running 
        if(currIdx == -1){
            sz++;
            result = realloc(result, sz*sizeof(execute));
            int ts=currTime , te=ts + processes[idx].exec_time;
            currTime = te;
            result[sz-1]=make_execute(&processes[idx],ts,te,processes[idx].events);
            currIdx = idx;
        }
        //if a process with a higher priority than the running one comes
        else if(processes[currIdx].priority < mxPriority){
            result[sz-1].te = processes[idx].arrival;
            processes[currIdx].exec_time -= processes[currIdx].exec_time - (currTime -processes[idx].arrival);
            int ts=processes[idx].arrival , te=processes[idx].arrival + processes[idx].exec_time;
            currTime = te;
            sz++;
            result = realloc(result,sz*sizeof(execute));
            result[sz-1] = make_execute(&processes[idx],ts,te,processes[idx].events);
            currIdx = idx;
        }
        else{
            ok[currIdx] = true;
            completed++;
            currIdx = -1;
        }
    }
    *(out_cnt) = sz;
    return result ;
}
