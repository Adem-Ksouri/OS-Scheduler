#ifndef SCHEDULER_EXECUTOR_H
#define SCHEDULER_EXECUTOR_H


int CreateConfigFileFromJson(
    const char *json_data,
    char *config_path,
    size_t config_path_size,
    char *algorithm,
    size_t algorithm_size,
    int *quantum,
    int *cpu_limit,
    int *nb_priority
);


char* RunSchedulerAndCaptureOutput(
    const char *config_path,
    const char *algorithm,
    int quantum,
    int cpu_limit,
    int nb_priority
);

#endif 