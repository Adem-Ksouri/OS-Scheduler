#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/scheduler.h"

int main() {
    freopen("unit_tests/output.txt", "w", stdout);

    // Create events
    event e1;
    e1.t = 1;
    strcpy(e1.comment, "gg");

    // Create an event array (equivalent of vector<event> e = {e1, e1})
    event* e = (event*)malloc(2 * sizeof(event));
    e[0] = e1;
    e[1] = e1;

    // Create processes
    process p1 = {
        .pid = 1,
        .ppid = 0,
        .name = "p1",
        .arrival = 0,
        .exec_time = 5,
        .priority = 4,
        .nbEvents = 2,
        .events = e,
    };

    process p2 = {
        .pid = 2,
        .ppid = 0,
        .name = "p2",
        .arrival = 2,
        .exec_time = 2,
        .priority = 1,
        .nbEvents = 2,
        .events = e,
    };

    process p3 = {
        .pid = 3,
        .ppid = 0,
        .name = "p3",
        .arrival = 4,
        .exec_time = 2,
        .priority = 7,
        .nbEvents = 2,
        .events = e,
    };

    process p4 = {
        .pid = 4,
        .ppid = 0,
        .name = "p4",
        .arrival = 8,
        .exec_time = 7,
        .priority = 2,
        .nbEvents = 2,
        .events = e,
    };

    // Allocate input process array
    process* input = (process*)malloc(4 * sizeof(process));
    input[0] = p1;
    input[1] = p2;
    input[2] = p3;
    input[3] = p4;

    // Run scheduler
    int out_count = 0;
    execute* output = fifo_scheduler(input, 4, &out_count);

    // Print results
    for (int i = 0; i < out_count; i++) {
        printf("%s %d %d\n", output[i].p.name, output[i].ts, output[i].te);
    }

    // Cleanup
    free(input);
    free(e);
    free(output);

    return 0;
}
