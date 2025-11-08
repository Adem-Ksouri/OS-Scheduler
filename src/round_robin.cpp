#include <stdio.h>
#include <queue>
#include <map>
#include <scheduler.h>
#include <algorithm>
using namespace std;

vector<execute> rr_scheduler(vector<process> processes, int Q){
    int N = processes.size();

    sort(processes.begin(), processes.end(), comp);

    map<int, int> time_executed;
    vector<execute> result;
    
    queue<process> q;
    for (process p : processes) q.push(p);

    int ind = 0, current_time = 0;
    while (ind < N || !q.empty()){
        // if there is no processes to execute, bring the first process from the remining processes
        if (q.empty()){
            q.push(processes[ind]);
            current_time = processes[ind++].arrival;
        }

        process p = q.front();
        q.pop();

        int ts = time_executed[p.pid];
        int te = min(ts + Q, p.exec_time);

        int execution_time = te - ts;
        time_executed[p.pid] += execution_time;
        
        vector<event> current_events;
        int s = lower_bound(p.events.begin(), p.events.end(), ts) - p.events.begin();
        for (int i = s; i < (int)p.events.size(); i++){
            if (p.events[i].t > te) break;
            current_events.push_back(p.events[i]);
        }
        
        execute exec(p, current_time, current_time + execution_time, current_events);
        result.push_back(exec);
        
        current_time += execution_time;

        // put the newely arravied processes in queue
        while (ind < N && processes[ind].arrival <= current_time)
            q.push(processes[ind++]);

        // put the current process if still have remaining execution time
        if (time_executed[p.pid] < p.exec_time)
            q.push(p);
    }

    return result;
}
