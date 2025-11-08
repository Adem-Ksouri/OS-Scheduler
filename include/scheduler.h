#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <string>
#include <vector>
using namespace std;

struct process {
    int pid;
    int ppid;
    string name;
    int arrival;
    int exec_time;
    int priority;
    vector<event> p_events;
};

struct execute {
    process p;
    int tl;
    int tr;
    vector<event> events;
};

struct event {
    int time;
    string comment;  
};

void fifo_scheduler(vector<process> processes);
void rr_scheduler(vector<process> processes);
void pp_scheduler(vector<process> processes);
void multilevel_scheduler(vector<process> processes);

#endif
