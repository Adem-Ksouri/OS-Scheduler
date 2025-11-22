#include <stdio.h>
#include <stdlib.h>
#include "../../Include/scheduler.h"
#include "../Include/queue.h"
#include "../Include/list.h"
#define min(a, b) ((a) < (b) ? (a) : (b))

typedef struct{
    process p;
    int rem_time;
    int cpu_usage;
} multilevel_process;

void add_to_queue(queue* q, multilevel_process* p){
    queue tmp = create_queue();
    while (size(*q) > 0){
        multilevel_process* curr = front(*q);
        if (curr->rem_time > p->rem_time){
            *q = pop(*q);
            tmp = push(tmp, curr);
        }
        else break;
    }
    *q = push(*q, p);
    while (size(tmp) > 0){
        multilevel_process* curr = front(tmp);
        tmp = pop(tmp);
        *q = push(*q, curr);
    }
}

int get_higher_priority(queue* queues, int nbPriority){
    for (int i = nbPriority - 1; i >= 0; i--){
        if (size(queues[i]) > 0)
            return i;
    }
    return -1;
}

event* get_events(event* events, int nbEvents, int l, int r){
    int cnt = 0;
    for (int i = 0; i < nbEvents; i++)
        if (events[i].t >= l && events[i].t <= r) cnt++;

    event* res = (event*)malloc(cnt * sizeof(event));
    cnt = 0;
    for (int i = 0; i < nbEvents; i++)
        if (events[i].t >= l && events[i].t <= r)
            res[cnt++] = events[i];

    return res;
}

void execute_processes(queue* queues, int nbPriority, int* currTime, int nxtTime, list* result, int cpu_usage_limit){
    while (*currTime < nxtTime){
        int priority = get_higher_priority(queues, nbPriority);

        if (priority == -1)
            break;

        multilevel_process* curr = front(queues[priority]);
        int exec_time = min(nxtTime - *currTime, curr->rem_time);

       execute* exec = (execute*)malloc(sizeof(execute));
        exec->p = &curr->p;
        exec->ts = *currTime;
        exec->te = *currTime + exec_time;
        int l = curr->p.exec_time - curr->rem_time;
        int r = l + exec_time;
        exec->events = get_events(curr->p.events, curr->p.nbEvents, l, r);
        add_tail(result, exec);
        curr->cpu_usage++;
        
        if (exec_time < curr->rem_time){
            curr->rem_time -= exec_time;

            if (curr->cpu_usage == cpu_usage_limit && priority > 0){
                add_to_queue(&queues[priority - 1], curr);
                queues[priority] = pop(queues[priority]);
                curr->cpu_usage = 0;
            }
        }
        else{
            queues[priority] = pop(queues[priority]);
        }

        *currTime += exec_time;
    }
}

execute* multilevel_scheduler(process* processes, int n, int nbPriority, int *out_cnt, int cpu_usage_limit){
    queue* queues = (queue*)malloc(nbPriority * sizeof(queue));
    for (int i = 0; i < nbPriority; i++)
        queues[i] = create_queue();

    list* result = create_list();
    
    qsort(processes, n, sizeof(process), compare_process);

    multilevel_process* multilevel_processes = (multilevel_process*)malloc(n * sizeof(multilevel_process));
    for (int i = 0; i < n; i++){
        multilevel_processes[i].cpu_usage = 0;
        multilevel_processes[i].p = processes[i];
        multilevel_processes[i].rem_time = processes[i].exec_time;
    }

    int currTime = 0;
    for (int i = 0; i < n; i++){
        int j = i;
        while (j < n && multilevel_processes[j].p.arrival == currTime){
            add_to_queue(&queues[multilevel_processes[j].p.priority], &multilevel_processes[j]);
            j++;
        }

        int nxtTime = j < n ? processes[j].arrival : 1e9;
        execute_processes(queues, nbPriority, &currTime, nxtTime, result, cpu_usage_limit);

        currTime = nxtTime;
        i = j - 1;
    }
    *out_cnt = getsz(result);
    execute* output = (execute*)malloc(*out_cnt * sizeof(execute));
    node* curr = result->head;
    for (int i = 0; i < *out_cnt; i++) {
        output[i] = *(execute*)curr->data;
        curr = curr->suiv;
    }
    return output;
}