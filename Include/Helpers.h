#include "Utils.h"

event getEventForTest(int t, char* comment);
event* getEventsForTest();
process* getProcessesForTest();
process* getDefaultProcessForTest(int pid);
process* getProcessForTest(int pid, int ppid, char* name, int arrival, int exec_time, int priority, int nbEvents, event* events);
execute* getExecuteForTest(int pid, int ts, int te);
