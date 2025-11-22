#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "utils.h"

execute* fifo_scheduler(process* processes, int n, int *out_cnt);
execute* rr_scheduler(process* processes, int n, int *out_cnt);
execute* pp_scheduler(process* processes, int n, int *out_cnt);
execute* multilevel_scheduler(process* processes, int n, int nbPriority, int *out_cnt, int cpu_usage_limit,int max_waiting_time);

#endif
