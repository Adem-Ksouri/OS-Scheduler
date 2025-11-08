#include <stdio.h>
#include <queue>
#include <scheduler.h>
#include <algorithm>
using namespace std;

vector<execute> fifo_scheduler(vector<process> processes){
    int n = processes.size();

    sort(processes.begin(), processes.end(), comp);

    vector<execute> result;

    int ts = 0, te;
    for (process p : processes){
        ts = max(ts, p.arrival);
        te = ts + p.exec_time;
        execute exc = {p, ts, te, p.events};
        result.push_back(exc);
    }    

    return result;
}
