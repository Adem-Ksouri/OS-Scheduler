#include <stdlib.h>
#include <string.h>
#include "../../Include/helpers.h"

event* getEventsForTest(){
    event e1;
    e1.t = 1;
    strcpy(e1.comment, "gg");

    event* e = (event*)malloc(2 * sizeof(event));
    e[0] = e1;
    e[1] = e1;

    return e;
}

process* getProcessesForTest(){
    event* e = getEventsForTest();
    
    process* p1 = getProcessForTest(1, 0, "p1", 0, 5, 4, 2, e); 
    process* p2 = getProcessForTest(2, 0, "p2", 2, 2, 1, 2, e); 
    process* p3 = getProcessForTest(3, 0, "p3", 4, 2, 7, 2, e); 
    process* p4 = getProcessForTest(4, 0, "p4", 8, 7, 2, 2, e);

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
    event* e = getEventsForTest();
    process* ret = (process*)malloc(sizeof(process));
    ret->pid = pid;
    ret->ppid = ppid;
    strcpy(ret->name, name);
    ret->arrival = arrival;
    ret->exec_time = exec_time;
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