#include <stdio.h>
#include <stdlib.h>
#include "../Include/Scheduler.h"
#include "../Include/Queue.h"

execute* rr_scheduler(process* processes, int n, int Q, int* out_count) {
    qsort(processes, n, sizeof(process), compare_process);

    queue q = create_queue();

    int run_time;
    int now = 0;
    int index = 0; // next process to insert into queue

    int capacity = 4;
    int count = 0;
    execute* result = malloc(sizeof(execute) * capacity);

    while (index < n || size(q) > 0) {

        while (index < n && processes[index].arrival <= now) {
            push(q, &processes[index]);
            index++;
        }

        if (size(q) == 0) {
            now = processes[index].arrival;
            continue;
        }

        process* p = front(q);
        pop(q);

        int remain = p->rem_time;

        if(remain > Q)
            run_time = Q;
        else
            run_time = remain;

        int ts = now;
        int te = now + run_time;

        p->rem_time -= run_time; 

        // get events
        int cnte;
        event* current_events = getEvents(*p, ts, te, &cnte);

        if (count == capacity) {
            capacity *= 2;
            result = realloc(result, sizeof(execute) * capacity);
        }

        result[count++] = make_execute(p, ts, te, current_events);

        now = te;

        // add newly arrived processes before requeueing
        while (index < n && processes[index].arrival <= now) {
            push(q, &processes[index]);
            index++;
        }

        // p not finished
        if (p->rem_time > 0) {
            push(q, p);
        }
    }

    *out_count = count;
    return result;
}