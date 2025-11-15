#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../../Include/helpers.h"
#include "../../Include/scheduler.h"

int main() {
    freopen("unit_tests/output.txt", "w", stdout);

    // Get dummy processes
    process* input = getProcessesForTest();

    // Run scheduler
    int out_count = 0;
    execute* output = fifo_scheduler(input, 4, &out_count);

    // Print results
    for (int i = 0; i < out_count; i++) {
        printf("%s %d %d\n", output[i].p.name, output[i].ts, output[i].te);
    }

    // Cleanup
    free(input);
    free(output);

    return 0;
}
