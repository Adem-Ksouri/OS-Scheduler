#include <stdlib.h>
#include <string.h>
#include "../../Include/Helpers.h"

event getEventForTest(int t, char* comment){
    event event;
    event.t = t;
    strcpy(event.comment, comment);
    return event;
}

// Create a separate copy of events for each process
event* getEventsForTest(){
    event e1 = getEventForTest(0, "output after 0 units");
    event e2 = getEventForTest(2, "output after 2 units");

    event* e = (event*)malloc(2 * sizeof(event));
    if (e == NULL) {
        return NULL;
    }
    e[0] = e1;
    e[1] = e2;

    return e;
}

process* getProcessesForTest(){
    // Create separate event arrays for each process
    event* e1 = getEventsForTest();
    event* e2 = getEventsForTest();
    event* e3 = getEventsForTest();
    event* e4 = getEventsForTest();
    
    if (e1 == NULL || e2 == NULL || e3 == NULL || e4 == NULL) {
        // Clean up on allocation failure
        free(e1);
        free(e2);
        free(e3);
        free(e4);
        return NULL;
    }

    //test2
    process* p1 = getProcessForTest(1, 0, "P1", 0, 10, 0, 2, e1);
    process* p2 = getProcessForTest(2, 0, "P2", 1, 3, 3, 2, e2);
    process* p3 = getProcessForTest(3, 0, "P3", 2, 3, 3, 2, e3);
    process* p4 = getProcessForTest(4, 0, "P4", 3, 3, 3, 2, e4);
    
    if (p1 == NULL || p2 == NULL || p3 == NULL || p4 == NULL) {
        // Clean up on allocation failure
        free(e1);
        free(e2);
        free(e3);
        free(e4);
        free(p1);
        free(p2);
        free(p3);
        free(p4);
        return NULL;
    }
     
    process* input = (process*)malloc(4 * sizeof(process));
    if (input == NULL) {
        free(e1);
        free(e2);
        free(e3);
        free(e4);
        free(p1);
        free(p2);
        free(p3);
        free(p4);
        return NULL;
    }
    
    // Copy the process structs (not pointers)
    input[0] = *p1;
    input[1] = *p2;
    input[2] = *p3;
    input[3] = *p4;
    
    // Free the temporary process pointers (but not the events, as they're now owned by input)
    free(p1);
    free(p2);
    free(p3);
    free(p4);
    
    return input;
}

process* getDefaultProcessForTest(int pid){
    return getProcessForTest(pid, 0, "test_process", 1, 8, 5, 2, getEventsForTest());
}

process* getProcessForTest(int pid, int ppid, char* name, int arrival, int exec_time, int priority, int nbEvents, event* events){
    process* ret = (process*)malloc(sizeof(process));
    if (ret == NULL) {
        return NULL;
    }
    
    ret->pid = pid;
    ret->ppid = ppid;
    strncpy(ret->name, name, sizeof(ret->name) - 1);
    ret->name[sizeof(ret->name) - 1] = '\0';  // Ensure null termination
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
    if (p == NULL) {
        return NULL;
    }
    
    execute* e = (execute*)malloc(sizeof(execute));
    if (e == NULL) {
        free(p->events);
        free(p);
        return NULL;
    }
    
    e->p = p;
    e->ts = ts;
    e->te = te;
    e->event_count = 0;
    e->events = NULL;
    
    return e;
}