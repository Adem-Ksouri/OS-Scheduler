#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <ctype.h>
#include <json-c/json.h>
#include "../../Include/SchedulerExecutor.h"
#include "../../Include/ResponseUtils.h"

int CreateConfigFileFromJson(
    const char *json_data,
    char *config_path,
    size_t config_path_size,
    char *algorithm,
    size_t algorithm_size,
    int *quantum,
    int *cpu_limit,
    int *nb_priority
) {
    json_object *root = json_tokener_parse(json_data);
    if (!root) {
        fprintf(stderr, "Failed to parse JSON\n");
        return -1;
    }
    
    json_object *jalgo = NULL;
    if (json_object_object_get_ex(root, "algorithm", &jalgo)) {
        const char *algo_str = json_object_get_string(jalgo);
        strncpy(algorithm, algo_str, algorithm_size - 1);
        algorithm[algorithm_size - 1] = '\0';
    } else {
        strcpy(algorithm, "Fifo");
    }
    
    json_object *jquantum = NULL;
    *quantum = json_object_object_get_ex(root, "quantum", &jquantum) ? 
               json_object_get_int(jquantum) : 2;
    
    json_object *jcpu_limit = NULL;
    *cpu_limit = json_object_object_get_ex(root, "cpu_usage_limit", &jcpu_limit) ? 
                 json_object_get_int(jcpu_limit) : 3;
    
    json_object *jnb_priority = NULL;
    *nb_priority = json_object_object_get_ex(root, "nb_priority", &jnb_priority) ? 
                   json_object_get_int(jnb_priority) : 20;
    
    json_object *jprocesses = NULL;
    if (!json_object_object_get_ex(root, "processes", &jprocesses)) {
        fprintf(stderr, "No processes array found\n");
        json_object_put(root);
        return -1;
    }
    
    int nb_processes = json_object_array_length(jprocesses);
    if (nb_processes == 0) {
        fprintf(stderr, "Empty processes array\n");
        json_object_put(root);
        return -1;
    }
    
    snprintf(config_path, config_path_size, 
             "/tmp/scheduler_config_%d_%ld.txt", 
             getpid(), (long)time(NULL));
    
    FILE *f = fopen(config_path, "w");
    if (!f) {
        fprintf(stderr, "Failed to create config file: %s\n", config_path);
        json_object_put(root);
        return -1;
    }
    
    fprintf(f, "# Config: %s, Processes: %d\n\n", algorithm, nb_processes);
    
    for (int i = 0; i < nb_processes; i++) {
        json_object *jproc = json_object_array_get_idx(jprocesses, i);
        
        json_object *jname, *jarrival, *jexec, *jpriority, *jnbevents;
        
        if (!json_object_object_get_ex(jproc, "name", &jname) ||
            !json_object_object_get_ex(jproc, "arrival", &jarrival) ||
            !json_object_object_get_ex(jproc, "exec_time", &jexec) ||
            !json_object_object_get_ex(jproc, "priority", &jpriority) ||
            !json_object_object_get_ex(jproc, "nbEvents", &jnbevents)) {
            fprintf(stderr, "Missing required process fields for process %d\n", i);
            fclose(f);
            remove(config_path);
            json_object_put(root);
            return -1;
        }
        
        int nbEvents = json_object_get_int(jnbevents);
        
        fprintf(f, "%s %d %d %d %d",
                json_object_get_string(jname),
                json_object_get_int(jarrival),
                json_object_get_int(jexec),
                json_object_get_int(jpriority),
                nbEvents);
       
        json_object *jevents = NULL;
        if (json_object_object_get_ex(jproc, "events", &jevents)) {
            int event_count = json_object_array_length(jevents);
            for (int j = 0; j < event_count && j < nbEvents; j++) {
                json_object *jevent = json_object_array_get_idx(jevents, j);
                json_object *jtime, *jcomment;
                
                if (!json_object_object_get_ex(jevent, "t", &jtime)) {
                    json_object_object_get_ex(jevent, "time", &jtime);
                }
                
                if (json_object_object_get_ex(jevent, "comment", &jcomment) && jtime) {
                    fprintf(f, " %d %s",
                            json_object_get_int(jtime),
                            json_object_get_string(jcomment));
                }
            }
        }
        
        fprintf(f, "\n");
    }
    
    fclose(f);
    json_object_put(root);
    
    return 0;
}

char* RunSchedulerAndCaptureOutput(
    const char *config_path,
    const char *algorithm,
    int quantum,
    int cpu_limit,
    int nb_priority
) {
    char command[1024];
    snprintf(command, sizeof(command),
             "./scheduler_cli %s %s %d %d %d 2>&1",
             config_path,
             algorithm,
             quantum,
             cpu_limit,
             nb_priority);
    
    fprintf(stderr, "Executing: %s\n", command);
    
    FILE *pipe = popen(command, "r");
    if (!pipe) {
        remove(config_path);
        return CreateErrorResponse("Failed to execute scheduler");
    }
    
    size_t buffer_size = 64 * 1024;
    char *result = malloc(buffer_size);
    if (!result) {
        pclose(pipe);
        remove(config_path);
        return CreateErrorResponse("Memory allocation failed");
    }
    
    size_t total_read = 0;
    size_t read_size;
    
    while ((read_size = fread(result + total_read, 1, 
            buffer_size - total_read - 1, pipe)) > 0) {
        total_read += read_size;
        
        if (total_read + 1024 > buffer_size) {
            buffer_size *= 2;
            char *new_result = realloc(result, buffer_size);
            if (!new_result) {
                free(result);
                pclose(pipe);
                remove(config_path);
                return CreateErrorResponse("Memory allocation failed");
            }
            result = new_result;
        }
    }
    
    result[total_read] = '\0';
    
    int status = pclose(pipe);
    
    fprintf(stderr, "Scheduler exit status: %d\n", status);
    fprintf(stderr, "Scheduler output length: %zu\n", total_read);
    
    if (total_read > 0) {
        fprintf(stderr, "First 200 chars of output: %.200s\n", result);
    }
    
    remove(config_path);
    
    if (status != 0) {
        fprintf(stderr, "Scheduler failed with status %d\n", status);
        fprintf(stderr, "Output: %s\n", result);
        free(result);
        return CreateErrorResponse("Scheduler execution failed");
    }
    
    if (total_read == 0) {
        free(result);
        return CreateErrorResponse("Scheduler produced no output");
    }
    
    return result;
}