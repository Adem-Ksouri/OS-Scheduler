#include <stdlib.h>
#include <string.h>
#include "../../Include/Scheduler.h"

int compare_process(const void* a, const void* b) {
    const process* e1 = (const process*)a;
    const process* e2 = (const process*)b;
    if(e1->arrival != e2->arrival)
        return (e1->arrival - e2->arrival); 

    return (e2->priority - e1->priority);
}

int compare_event(const void* a, const void* b) {
    const event* e1 = (const event*)a;
    const event* e2 = (const event*)b;

    return (e1->t - e2->t);
}

event* getEvents(process p, int tl, int tr, int* out_count) {
    int st = 0;
    while (st < p.nbEvents && p.events[st].t < tl) {
        st++;
    }

    event* result = NULL;
    int count = 0;

    while (st < p.nbEvents) {
        if (p.events[st].t > tr)
            break;

        result = realloc(result, (count + 1) * sizeof(event));
        result[count] = p.events[st];
        count++;
        st++;
    }

    *out_count = count;
    return result;
}

execute* make_execute(process* p, int ts, int te, event* events) {
    execute* exc = (execute*)malloc(sizeof(execute));
    exc->p = p;
    exc->ts = ts;
    exc->te = te;
    exc->events = events;
    return exc;
}

process* make_process(process* p){
    process* ret = (process*)malloc(sizeof(process));
    ret->pid = p->pid;
    ret->ppid = p->ppid;
    ret->arrival = p->arrival;
    ret->exec_time = p->exec_time;
    ret->priority = p->priority;
    strcpy(ret->name, p->name);
    ret->events = p->events;
    ret->rem_time = p->rem_time;
    ret->nbEvents = p->nbEvents;
    return ret;
}