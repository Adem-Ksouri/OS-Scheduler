#include <stdlib.h>
#include <string.h>
#include "../../Include/Helpers.h"

event getEventForTest(int t, char* comment){
    event event;
    event.t = t;
    strcpy(event.comment, comment);
    return event;
}


event* getEventsForTest(){
    event e1 = getEventForTest(0, "output after 0 units");
    event e2 = getEventForTest(2, "output after 2 units");

    event* e = (event*)malloc(2 * sizeof(event));
    e[0] = e1;
    e[1] = e2;

    return e;
}

process* getProcessesForTest(){
    event* e = getEventsForTest();
    
    // process* p1 = getProcessForTest(1, 0, "p1", 0, 5, 4, 2, e); 
    // process* p2 = getProcessForTest(2, 0, "p2", 2, 2, 1, 2, e); 
    // process* p3 = getProcessForTest(3, 0, "p3", 4, 2, 7, 2, e); 
    // process* p4 = getProcessForTest(4, 0, "p4", 8, 7, 2, 2, e); 

    // process* input = (process*)malloc(4 * sizeof(process));
    // input[0] = *p1;
    // input[1] = *p2;
    // input[2] = *p3;
    // input[3] = *p4;
    //test2
    process* p1 = getProcessForTest(1, 0, "P1", 0, 4, 0, 2, e);
    process* p2 = getProcessForTest(2, 0, "P2", 1, 3, 3, 2, e);
    process* p3 = getProcessForTest(3, 0, "P3", 2, 3, 3, 2, e);
    process* p4 = getProcessForTest(4, 0, "P4", 3, 3, 3, 2, e);
     
     //test3
    // process* p1 = getProcessForTest(1, 0, "P1", 0, 6, 2, 2, e);
    // process* p2 = getProcessForTest(2, 0, "P2", 1, 4, 2, 2, e);
    // process* p3 = getProcessForTest(3, 0, "P3", 2, 1, 2, 2, e);
    // process* p4 = getProcessForTest(4, 0, "P4", 3, 2, 2, 2, e);
    //test4:
    // process* p1 = getProcessForTest(1, 0, "P1", 0, 10, 2, 2, e);
    // process* p2 = getProcessForTest(2, 0, "P2", 1, 3, 0, 2, e);
    // process* p3 = getProcessForTest(3, 0, "P3", 2, 4, 0, 2, e);
    // process* p4 = getProcessForTest(4, 0, "P4", 8, 2, 0, 2, e);
     //test5:
    // process* p1 = getProcessForTest(1, 0, "P1", 0, 9, 1, 2, e);
    // process* p2 = getProcessForTest(2, 0, "P2", 0, 8, 0, 2, e);
    // process* p3 = getProcessForTest(3, 0, "P3", 0, 9, 0, 2, e);
    // process* p4 = getProcessForTest(4, 0, "P4", 8, 2, 0, 2, e);
    process* input = (process*)malloc(4 * sizeof(process));
    input[0] = *p1;
    input[1] = *p2;
    input[2] = *p3;
    input[3] = *p4;
    return input;
}

process* getDefaultProcessForTest(int pid){
    return getProcessForTest(pid, 0, "test_process", 1, 8, 5, 2, getEventsForTest());
}

process* getProcessForTest(int pid, int ppid, char* name, int arrival, int exec_time, int priority, int nbEvents, event* events){
    process* ret = (process*)malloc(sizeof(process));
    ret->pid = pid;
    ret->ppid = ppid;
    strcpy(ret->name, name);
    ret->arrival = arrival;
    ret->exec_time = exec_time;
    ret->rem_time = exec_time;
    ret->cpu_usage = 0;
    ret->priority = priority;
    ret->nbEvents = nbEvents;
    ret->events = events;
    return ret;
}

execute* getExecuteForTest(int pid, int ts, int te) {
    process* p = getDefaultProcessForTest(pid);
    execute* e = (execute*)malloc(sizeof(execute));
    e->p = p;
    e->ts = ts;
    e->te = te;
    return e;
}