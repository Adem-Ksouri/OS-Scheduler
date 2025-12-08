#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../../Include/Helpers.h"
#include "../../Include/Scheduler.h"

int main() {
    freopen("UnitTests/TestsOutput/MultilevelUnitTest.txt", "w", stdout);

    process* input = getProcessesForTest();

    int out_count = 0;
    execute* output = multilevel_scheduler(input, 4, 8, &out_count, 3);

    for (int i = 0; i < out_count; i++) {
        printf("%s %d %d\n", output[i].p->name, output[i].ts, output[i].te);
    }

    return 0;
}
