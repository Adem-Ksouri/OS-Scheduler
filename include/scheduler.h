#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

// event type
typedef struct {
    int t;  // after t seconds of execution, the process will print a comment
    char comment[250];
} event;

// process type
typedef struct{
    int pid;
    int ppid;
    char name[20];
    int arrival;
    int exec_time;
    int priority;
    int nbEvents;
    event* events;
} process;

// execute type
typedef struct {
    process p;
    int ts;
    int te;
    event* events;
} execute;

int compare_event(const void* a, const void* b);
event* getEvents(process p, int tl, int tr, int *out_cnt);
int compare_process(const void* a, const void* b);
execute make_execute(process p, int tl, int tr, event* events);

execute* fifo_scheduler(process* processes, int n, int *out_cnt);
execute* rr_scheduler(process* processes, int n, int *out_cnt);
execute* pp_scheduler(process* processes, int n, int *out_cnt);
execute* multilevel_scheduler(process* processes, int n, int quantum, int *out_cnt);

#endif
