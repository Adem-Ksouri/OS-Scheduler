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

    while (!q.empty()){
        process p = q.front();
        q.pop();

        int ts = time_executed[p.pid];
        int te = min(ts + Q, p.exec_time);

        time_executed[p.pid] += te - ts;
        
        vector<event> current_events;
        int s = lower_bound(p.events.begin(), p.events.end(), ts) - p.events.begin();
        for (int i = s; i < (int)p.events.size(); i++){
            if (p.events[i].t >= te) break;
            current_events.push_back(p.events[i]);
        }

        execute exec(p, ts, te, current_events);
        result.push_back(exec);

        if (time_executed[p.pid] < p.exec_time)
            q.push(p);
    }

    return result;
}
