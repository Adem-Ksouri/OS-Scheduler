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
    if (out_count == NULL) return NULL;
    
    *out_count = 0;
    
    if (p.events == NULL || p.nbEvents <= 0) {
        return NULL;
    }
    
    int st = 0;
    while (st < p.nbEvents && p.events[st].t < tl) {
        st++;
    }

    event* result = NULL;
    int count = 0;

    while (st < p.nbEvents) {
        if (p.events[st].t >= tr)
            break;

        event* temp = (event*)realloc(result, (count + 1) * sizeof(event));
        if (temp == NULL) {
            // Allocation failed, free what we have and return
            free(result);
            *out_count = 0;
            return NULL;
        }
        result = temp;
        result[count] = p.events[st];
        count++;
        st++;
    }

    *out_count = count;
    return result;
}

execute make_execute(process* p, int ts, int te, int event_count, event* events) {
    execute exc;
    exc.p = p;
    exc.ts = ts;
    exc.te = te;
    exc.event_count = event_count;
    exc.events = events;
    return exc;
}