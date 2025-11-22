#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../../Include/helpers.h"
#include "../../Include/scheduler.h"

int main() {
    freopen("UnitTests/RoundRobinUnitTests/output.txt", "w", stdout);

    process* input = getProcessesForTest();

    int out_count = 0;
    execute* output = rr_scheduler(input, 4, 2, &out_count);
    for (int i = 0; i < out_count; i++) {
        printf("%s %d %d\n", output[i].p->name, output[i].ts, output[i].te);
    }

    return 0;
}
