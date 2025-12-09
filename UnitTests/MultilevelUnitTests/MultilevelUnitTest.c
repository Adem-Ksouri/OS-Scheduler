#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <errno.h>
#include "../../Include/Helpers.h"
#include "../../Include/Scheduler.h"

int main() {
    // Create the TestsOutput directory if it doesn't exist
    struct stat st = {0};
    if (stat("TestsOutput", &st) == -1) {
        #ifdef _WIN32
            mkdir("TestsOutput");
        #else
            mkdir("TestsOutput", 0755);
        #endif
    }

    FILE* fp = freopen("TestsOutput/MultilevelUnitTest.txt", "w", stdout);
    if (fp == NULL) {
        fprintf(stderr, "Error: Could not open output file: %s\n", strerror(errno));
        fprintf(stderr, "Current working directory issue - trying alternative path\n");
        
        // Try creating UnitTests/TestsOutput directory
        if (stat("UnitTests/TestsOutput", &st) == -1) {
            #ifdef _WIN32
                mkdir("UnitTests");
                mkdir("UnitTests/TestsOutput");
            #else
                mkdir("UnitTests", 0755);
                mkdir("UnitTests/TestsOutput", 0755);
            #endif
        }
        
        fp = freopen("UnitTests/TestsOutput/MultilevelUnitTest.txt", "w", stdout);
        if (fp == NULL) {
            fprintf(stderr, "Error: Still could not open output file: %s\n", strerror(errno));
            return 1;
        }
    }

    process* input = getProcessesForTest();
    if (input == NULL) {
        fprintf(stderr, "Error: Failed to create test processes\n");
        fclose(fp);
        return 1;
    }

    fprintf(stderr, "Created test processes successfully\n");
    fprintf(stderr, "Process 0: pid=%d, arrival=%d, exec_time=%d, priority=%d\n", 
            input[0].pid, input[0].arrival, input[0].exec_time, input[0].priority);

    int out_count = 0;
    fprintf(stderr, "Calling multilevel_scheduler...\n");
    execute* output = multilevel_scheduler(input, 4, 10, &out_count, 3);
    fprintf(stderr, "Scheduler returned, out_count=%d\n", out_count);

    if (output == NULL) {
        fprintf(stderr, "Error: Scheduler returned NULL\n");
        // Clean up input
        for (int i = 0; i < 4; i++) {
            if (input[i].events != NULL) {
                free(input[i].events);
            }
        }
        free(input);
        fclose(fp);
        return 1;
    }

    for (int i = 0; i < out_count; i++) {
        if (output[i].p != NULL) {
            printf("%s %d %d\n", output[i].p->name, output[i].ts, output[i].te);
            printf("number of events is %d :\n", output[i].event_count);
            
            if (output[i].events != NULL) {
                for (int j = 0; j < output[i].event_count; j++) {
                    printf("%d %s\n", output[i].events[j].t, output[i].events[j].comment);
                }
            }
            printf("\n");
        }
    }

    // Clean up
    for (int i = 0; i < out_count; i++) {
        if (output[i].events != NULL) {
            free(output[i].events);
        }
    }
    free(output);

    // Clean up input processes
    for (int i = 0; i < 4; i++) {
        if (input[i].events != NULL) {
            free(input[i].events);
        }
    }
    free(input);

    fclose(fp);
    return 0;
}