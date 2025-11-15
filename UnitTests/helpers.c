#include <stdlib.h>
#include <string.h>
#include "../Include/helpers.h"

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
    
    process p1 = {
        .pid = 1,
        .ppid = 0,
        .name = "p1",
        .arrival = 0,
        .exec_time = 5,
        .priority = 4,
        .nbEvents = 2,
        .events = e,
    };

    process p2 = {
        .pid = 2,
        .ppid = 0,
        .name = "p2",
        .arrival = 2,
        .exec_time = 2,
        .priority = 1,
        .nbEvents = 2,
        .events = e,
    };

    process p3 = {
        .pid = 3,
        .ppid = 0,
        .name = "p3",
        .arrival = 4,
        .exec_time = 2,
        .priority = 7,
        .nbEvents = 2,
        .events = e,
    };

    process p4 = {
        .pid = 4,
        .ppid = 0,
        .name = "p4",
        .arrival = 8,
        .exec_time = 7,
        .priority = 2,
        .nbEvents = 2,
        .events = e,
    };

    process* input = (process*)malloc(4 * sizeof(process));
    input[0] = p1;
    input[1] = p2;
    input[2] = p3;
    input[3] = p4;

    return input;
}

process getProcessForTest(int pid){
    event* e = getEventsForTest();
    process ret = {
        .pid = pid,
        .ppid = 0,
        .name = "p4",
        .arrival = 8,
        .exec_time = 7,
        .priority = 2,
        .nbEvents = 2,
        .events = e,
    };
    return ret;
}

execute getExecuteForTest(int pid, int ts, int te) {
    process p = getProcessForTest(pid);
    execute e = {
        .p = p,
        .ts = ts,
        .te = te
    };
    return e;
}