#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <time.h>
#include "../../Include/AlgorithmCache.h"

#define CACHE_VALIDITY_SECONDS 60

static AlgorithmCache algo_cache = {
    .algorithms = NULL,
    .count = 0,
    .last_scan = 0,
    .lock = PTHREAD_MUTEX_INITIALIZER
};

static AlgorithmInfo* DetectAvailableAlgorithms(const char *schedulers_path, int *count) {
    DIR *dir = opendir(schedulers_path);
    if (!dir) {
        fprintf(stderr, "Warning: Cannot open schedulers directory: %s\n", schedulers_path);
        *count = 0;
        return NULL;
    }
    
    struct dirent *entry;
    int capacity = 10;
    int found = 0;
    
    AlgorithmInfo *algorithms = malloc(sizeof(AlgorithmInfo) * capacity);
    if (!algorithms) {
        closedir(dir);
        *count = 0;
        return NULL;
    }
    
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }
        
        size_t len = strlen(entry->d_name);
        if (len > 2 && strcmp(entry->d_name + len - 2, ".c") == 0) {
            char name[50];
            strncpy(name, entry->d_name, len - 2);
            name[len - 2] = '\0';
            
            if (strcmp(name, "main") == 0 || strcmp(name, "test") == 0) {
                continue;
            }
            
            if (found >= capacity) {
                capacity *= 2;
                AlgorithmInfo *new_algos = realloc(algorithms, sizeof(AlgorithmInfo) * capacity);
                if (!new_algos) {
                    free(algorithms);
                    closedir(dir);
                    *count = 0;
                    return NULL;
                }
                algorithms = new_algos;
            }
            
            strcpy(algorithms[found].name, name);
            strcpy(algorithms[found].display_name, name);
            if (algorithms[found].display_name[0] >= 'a' && algorithms[found].display_name[0] <= 'z') {
                algorithms[found].display_name[0] -= 32;
            }
            
            algorithms[found].has_quantum = 0;
            algorithms[found].has_priority = 0;
            algorithms[found].has_cpu_limit = 0;
            
            if (strcasecmp(name, "RoundRobin") == 0 || strcasecmp(name, "rr") == 0) {
                algorithms[found].has_quantum = 1;
            }
            
            if (strcasecmp(name, "Multilevel") == 0 || strcasecmp(name, "mlq") == 0) {
                algorithms[found].has_priority = 1;
                algorithms[found].has_cpu_limit = 1;
            }
            
            found++;
        }
    }
    
    closedir(dir);
    *count = found;
    
    return algorithms;
}

AlgorithmInfo* GetCachedAlgorithms(const char *schedulers_path, int *count) {
    pthread_mutex_lock(&algo_cache.lock);
    
    time_t now = time(NULL);
    
    if (algo_cache.algorithms && 
        (now - algo_cache.last_scan) < CACHE_VALIDITY_SECONDS) {
        AlgorithmInfo *result = malloc(sizeof(AlgorithmInfo) * algo_cache.count);
        if (result) {
            memcpy(result, algo_cache.algorithms, sizeof(AlgorithmInfo) * algo_cache.count);
            *count = algo_cache.count;
        } else {
            *count = 0;
        }
        pthread_mutex_unlock(&algo_cache.lock);
        return result;
    }
    
    if (algo_cache.algorithms) {
        free(algo_cache.algorithms);
    }
    
    algo_cache.algorithms = DetectAvailableAlgorithms(schedulers_path, &algo_cache.count);
    algo_cache.last_scan = now;
    
    AlgorithmInfo *result = NULL;
    if (algo_cache.algorithms) {
        result = malloc(sizeof(AlgorithmInfo) * algo_cache.count);
        if (result) {
            memcpy(result, algo_cache.algorithms, sizeof(AlgorithmInfo) * algo_cache.count);
            *count = algo_cache.count;
        } else {
            *count = 0;
        }
    } else {
        *count = 0;
    }
    
    pthread_mutex_unlock(&algo_cache.lock);
    return result;
}

void InitAlgorithmCache(void) {
    pthread_mutex_init(&algo_cache.lock, NULL);
}

void CleanupAlgorithmCache(void) {
    pthread_mutex_lock(&algo_cache.lock);
    if (algo_cache.algorithms) {
        free(algo_cache.algorithms);
        algo_cache.algorithms = NULL;
    }
    pthread_mutex_unlock(&algo_cache.lock);
    pthread_mutex_destroy(&algo_cache.lock);
}