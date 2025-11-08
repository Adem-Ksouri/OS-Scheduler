#include <stdio.h>
#include <queue>
#include <scheduler.h>
#include <algorithm>
using namespace std;

bool comp(process p1, process p2){
    return p1.arrival < p2.arrival;
}

queue<process> q;

void fifo_scheduler(vector<process> processes){
    int n = processes.size();

    sort(processes.begin(), processes.end(), comp);

    for (int i = 0; i < n; i++){
        
    }    
}
