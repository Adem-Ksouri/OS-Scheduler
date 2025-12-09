#include <stdio.h>
#include <stdlib.h>
#include "../../Include/Scheduler.h"
#include "../../Include/Queue.h"
#include "../../Include/List.h"
#include "../../Include/Utils.h"

#define min(a, b) ((a) < (b) ? (a) : (b))

void add_to_queue(queue* q, process* p){
    if (q == NULL || p == NULL) return;
    
    queue tmp = create_queue();
    while (size(*q) > 0){
        process* curr = front(*q);
        if (curr != NULL && curr->rem_time > p->rem_time){
            *q = pop(*q);
            tmp = push(tmp, curr);
        }
        else break;
    }
    *q = push(*q, p);
    while (size(tmp) > 0){
        process* curr = front(tmp);
        tmp = pop(tmp);
        *q = push(*q, curr);
    }
}

int get_higher_priority(queue* queues, int nbPriority){
    if (queues == NULL) return -1;
    
    for (int i = nbPriority - 1; i >= 0; i--){
        if (size(queues[i]) > 0)
            return i;
    }
    return -1;
}

void appendEvents(event** events, int eventsCount, event* eventsToAdd, int eventsToAddCount){
    if (events == NULL || eventsToAdd == NULL || eventsToAddCount <= 0) return;
    
    int totalEventsCount = eventsCount + eventsToAddCount;
    event* newEvents = (event*)realloc(*events, totalEventsCount * sizeof(event));
    if (newEvents == NULL) {
        // Handle allocation failure - keep original events
        return;
    }
    *events = newEvents;

    for (int i = 0; i < eventsToAddCount; i++) {
        (*events)[eventsCount + i] = eventsToAdd[i];
    }
}

void execute_processes(queue* queues, int nbPriority, int* currTime, int nxtTime, list* result, int cpu_usage_limit){
    if (queues == NULL || currTime == NULL || result == NULL) return;
    
    while (*currTime < nxtTime){
        int priority = get_higher_priority(queues, nbPriority);

        if (priority == -1)
            break;

        process* curr = front(queues[priority]);
        if (curr == NULL) break;
        
        int exec_time = min(nxtTime - *currTime, curr->rem_time);

        int l = curr->exec_time - curr->rem_time;
        int r = l + exec_time;

        int evt_cnt = 0;
        event* ev_list = getEvents(*curr, l, r, &evt_cnt);

        execute* exec = (execute*)malloc(sizeof(execute));
        if (exec == NULL) {
            free(ev_list);
            break;
        }
        *exec = make_execute(curr, *currTime, *currTime + exec_time, evt_cnt, ev_list);

        node* lst = result->tail;
        if (lst != NULL && lst->data != NULL) {
            execute* last_exec = (execute*)lst->data;
            if (last_exec->p != NULL && last_exec->p->pid == exec->p->pid){
                last_exec->te = exec->te;
                if (evt_cnt > 0 && ev_list != NULL) {
                    appendEvents(&last_exec->events, last_exec->event_count, ev_list, evt_cnt);
                    last_exec->event_count += evt_cnt;
                }
                free(ev_list);
                free(exec);
            }
            else {
                add_tail(result, exec);
            }
        }
        else {
            add_tail(result, exec);
        }

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
    if (processes == NULL || n <= 0 || nbPriority <= 0 || out_cnt == NULL) {
        if (out_cnt != NULL) *out_cnt = 0;
        return NULL;
    }

    queue* queues = (queue*)malloc(nbPriority * sizeof(queue));
    if (queues == NULL) {
        *out_cnt = 0;
        return NULL;
    }
    
    for (int i = 0; i < nbPriority; i++)
        queues[i] = create_queue();

    list* result = create_list();
    if (result == NULL) {
        free(queues);
        *out_cnt = 0;
        return NULL;
    }

    qsort(processes, n, sizeof(process), compare_process);

    int currTime = 0;
    for (int i = 0; i < n; i++){
        int j = i;
        while (j < n && processes[j].arrival == currTime){
            // Validate priority is within bounds
            if (processes[j].priority >= 0 && processes[j].priority < nbPriority) {
                add_to_queue(&queues[processes[j].priority], &processes[j]);
            }
            j++;
        }
        
        int nxtTime = j < n ? processes[j].arrival : 1000000000;
        execute_processes(queues, nbPriority, &currTime, nxtTime, result, cpu_usage_limit);

        currTime = nxtTime;
        i = j - 1;
    }

    *out_cnt = getsz(result);
    execute* output = (execute*)malloc(*out_cnt * sizeof(execute));
    if (output == NULL) {
        free(queues);
        *out_cnt = 0;
        return NULL;
    }
    
    node* curr = result->head;
    for (int i = 0; i < *out_cnt; i++) {
        if (curr == NULL || curr->data == NULL) break;
        output[i] = *(execute*)curr->data;
        curr = curr->suiv;
    }

    free(queues);
    return output;
}