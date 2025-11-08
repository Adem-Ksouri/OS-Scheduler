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
    vector<event> events;
};

struct execute {
    process p;
    int tl;
    int tr;
    vector<event> events;

    execute(process _p, int _tl, int _tr, vector<event> _events){
        p = _p;
        tl = _tl;
        tr = _tr;
        events = _events;
    }
};

struct event {
    // after t seconds of execution, the process will print a comment
    int t; 
    string comment;  
};

bool comp(process p1, process p2){
    return p1.arrival < p2.arrival;
}

vector<execute> fifo_scheduler(vector<process> processes);
vector<execute> rr_scheduler(vector<process> processes, int Q);
vector<execute> pp_scheduler(vector<process> processes);
vector<execute> multilevel_scheduler(vector<process> processes);

#endif
