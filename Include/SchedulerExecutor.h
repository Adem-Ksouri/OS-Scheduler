// Include/SchedulerExecutor.h
#ifndef SCHEDULER_EXECUTOR_H
#define SCHEDULER_EXECUTOR_H

/**
 * Create a configuration file from JSON data
 * 
 * @param json_data JSON string containing the configuration
 * @param config_path Output buffer for configuration file path
 * @param config_path_size Size of config_path buffer
 * @param algorithm Output buffer for algorithm name
 * @param algorithm_size Size of algorithm buffer
 * @param quantum Output parameter for quantum value
 * @param cpu_limit Output parameter for CPU limit
 * @param nb_priority Output parameter for number of priorities
 * @return 0 on success, -1 on error
 */
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

/**
 * Run the scheduler and capture its output
 * 
 * @param config_path Path to configuration file
 * @param algorithm Algorithm name
 * @param quantum Quantum value
 * @param cpu_limit CPU limit value
 * @param nb_priority Number of priorities
 * @return JSON string with results (must be freed by caller)
 */
char* RunSchedulerAndCaptureOutput(
    const char *config_path,
    const char *algorithm,
    int quantum,
    int cpu_limit,
    int nb_priority
);

#endif // SCHEDULER_EXECUTOR_H