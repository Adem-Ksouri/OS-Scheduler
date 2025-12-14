#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../../Include/Helpers.h"
#include "../../Include/Scheduler.h"

int main() {
    freopen("TestsOutput/Fifo.txt", "w", stdout);

    process* input = getProcessesForTest();

    int out_count = 0;
    execute* output = fifo_scheduler(input, 4, &out_count);

    for (int i = 0; i < out_count; i++) {
        printf("%s %d %d\n", output[i].p->name, output[i].ts, output[i].te);
        printf("number of events is %d :\n", output[i].event_count);
        for (int j = 0; j < output[i].event_count; j++)
            printf("%d %s\n",output[i].events[j].t, output[i].events[j].comment);
        printf("\n");
    }
    
    return 0;
}
