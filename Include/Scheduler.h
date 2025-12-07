#ifndef SCHEDULER_H
#define SCHEDULER_H

#include "Utils.h"

execute* fifo_scheduler(process* processes, int n, int *out_cnt);
execute* rr_scheduler(process* processes, int n, int Q, int *out_cnt);
execute* pp_scheduler(process* processes, int n, int *out_cnt);
execute* multilevel_scheduler(process* processes, int n, int quantum, int *out_cnt);

#endif
