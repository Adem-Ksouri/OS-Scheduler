#include "../../Include/scheduler.h"

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

//compare processes by priority ascending
int compare_by_priority(const void* a, const void* b) {
    const process* e1 = (const process*)a;
    const process* e2 = (const process*)b;
    
    return (e1->priority - e2->priority);
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

execute make_execute(process* p, int ts, int te, event* events) {
    execute exc;
    exc.p = p;
    exc.ts = ts;
    exc.te = te;
    exc.events = events;
    return exc;
}
