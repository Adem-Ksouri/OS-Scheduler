#include <stdio.h>
#include <vector>
#include <map>
#include <algorithm>
#include <scheduler.h>
using namespace std;

// How much time a process executed
map<int, int> executed_time;

// How much time a process waited since last execution
map<process, int> waiting;

// For each priority, we have a queue of processes
map<int, vector<process>> queues;

int ts = 0;
int te; 

vector<execute> multilevel_scheduler(vector<process> processes, int quantum, int waiting_time){
    int n = processes.size();
    sort(processes.begin(), processes.end());
    
    vector<execute> result;
    for (process p : processes){
        exec_ready_before_t(result, p.arrival, quantum, waiting_time);
        ins(p);
        waiting[p] = 0;
    }
    exec_ready_before_t(result, (int)2e9, quantum, waiting_time);
    return result;
}

void exec_ready_before_t(vector<execute> &result, int t, int quantum, int waiting_time){
    while (!queues.empty()) {
        if (ts == t) break;

        auto it = prev(queues.end());
        process cur_p = (*it).second.back();
        (*it).second.pop_back();
        
        int rem_time = cur_p.exec_time - executed_time[cur_p.pid];
        ts = max(ts, cur_p.arrival);
        te = min({ts + quantum, ts + rem_time, t});
         
        waiting[cur_p] = 0;

        // take the changed process
        for (auto [p, wt] : waiting)
            if (wt + te - ts >= waiting_time)
                te = min(te, ts + waiting_time - wt);
        
        executed_time[cur_p.pid] += te - ts;
        if (executed_time[cur_p.pid] < cur_p.exec_time)
            ins(cur_p);
        execute exec = {cur_p, ts, te, cur_p.getEvents(ts, te)};
        result.push_back(exec);

        update_waiting_processes(cur_p, te - ts, waiting_time);
        ts = te;
    }
}

void update_waiting_processes(process cur_p, int exec_time, int waiting_time) {
    // Could be ready processes having priority changed
    for (auto [p, wt] : waiting){
        if (p.pid == cur_p.pid) continue;
        if (wt + exec_time == waiting_time){
            // priority changed
            waiting[p] = 0;
            
            int pr = p.priority;
            process del_p = del(queues[pr], p.pid);
            
            pr++;
            del_p.priority = pr;

            ins(del_p);
        }else {
            // priority not changed
            waiting[p] += exec_time;
        }
    }
}

void ins(process p){
    int pr = p.priority;
    queues[pr].insert(queues[pr].begin(), p);
}

process del(vector<process> &vec, int pid) {
    int idx = -1;
    for (int i = 0; i < vec.size(); i++)
        if (vec[i].pid == pid) {
            idx = i;
            break;
        }
    if (idx == -1) return;
    process ret = vec[idx];
    vec.erase(vec.begin() + idx);
    return ret;
}
