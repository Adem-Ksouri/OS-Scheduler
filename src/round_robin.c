// #include <stdio.h>
// #include "../include/scheduler.h"

// execute* rr_scheduler(process* processes, int n, int Q){
//     int N = processes.size();

//     sort(processes.begin(), processes.end());

//     map<int, int> time_executed;
//     vector<execute> result;
    
//     queue<process> q;
//     for (process p : processes) q.push(p);

//     while (!q.empty()){
//         process p = q.front();
//         q.pop();

//         int ts = time_executed[p.pid];
//         int te = min(ts + Q, p.exec_time);

//         time_executed[p.pid] += te - ts;
        
//         int cnte;
//         event* current_events = getEvents(p, ts, te, &cnte);

//         execute exec = make_execute(p, ts, te, current_events);
//         result.push_back(exec);

//         if (time_executed[p.pid] < p.exec_time)
//             q.push(p);
//     }

//     return result;
// }
