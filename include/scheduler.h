#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <string>
#include <vector>
using namespace std;

struct process{
    int pid;
    int ppid;
    string name;
    int arrival;
    int exec_time;
    int priority;
};

void fifo_scheduler(vector<process> processes);
void rr_scheduler(vector<process> processes);
void pp_scheduler(vector<process> processes);
void multilevel_scheduler(vector<process> processes);

#endif
