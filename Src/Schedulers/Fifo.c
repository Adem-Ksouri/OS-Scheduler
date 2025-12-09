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

        result[i].p = make_process(&processes[i]);
        result[i].ts = ts;
        result[i].te = te;
        result[i].events = processes[i].events;

        ts = te;
    }

    *out_count = n;
    return result;
}
