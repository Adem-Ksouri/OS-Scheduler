#include <stdio.h>
#include <stdlib.h>
#include "../../Include/scheduler.h"
#include "queue.h"

execute* pp_scheduler(process* processes, int n, int *out_cnt) {
    //sort the processes in ascending order of priority
    qsort(processes, n, sizeof(process),compare_by_priority);
    //compressing priorities to be numbered between 0..'number of distinct priorities' 
    int currp = 0;
    for(int i=0;i<n;i++){
        if(currp != processes[i].priority){
            processes[i].priority = currp;
            currp++;
        }
    }
    // a list of queues to make a queue for each priority 
    queue p_by_priority[currp];
    //for(int i=0;i<currp;i++)p_by_priority[i] = create_queue();
    
    // a list for execute result 
    list* result = create_list();
    
    qsort(processes, n, sizeof(process), compare_process);
    int currTime = 0,currPriority = -__INT_MAX__;
    for(int i=0;i<n;i++){
        if(processes[i].arrival > currTime){
            if(processes[i].priority > currPriority){
                execute* tail = (execute*)get_tail(result);
                tail->te = processes[i].arrival;
                processes[i-1].exec_time-=currTime-processes[i].arrival;
                currTime = processes[i].arrival+processes[i].exec_time;

                execute ex1 = make_execute(&processes[i],processes[i].arrival,currTime,processes[i].events);
                add_tail(result, &ex1);
            }
            else{

            }
        }
    }

}
