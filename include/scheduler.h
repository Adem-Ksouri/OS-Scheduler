#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <string>
#include <vector>
using namespace std;

struct event {
    // after t seconds of execution, the process will print a comment
    int t; 
    string comment;  
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

struct process{
    int pid;
    int ppid;
    string name;
    int arrival;
    int exec_time;
    int priority;
    vector<event> events;

    bool operator<(const process &other) const {
        return arrival < other.arrival;
    }

    vector<event> getEvents(int tl, int tr) {
        int st = lower_bound(events.begin(), events.end(), tl) - events.begin();
        vector<event> result;
        while (st < (int)events.size()){
            if (events[st].t > tr) break;
            result.push_back(events[st++]);
        }
        return result;
    }
};

vector<execute> fifo_scheduler(vector<process> processes);
vector<execute> rr_scheduler(vector<process> processes);
vector<execute> pp_scheduler(vector<process> processes);
vector<execute> multilevel_scheduler(vector<process> processes, int quantum, int waiting_time);

#endif
