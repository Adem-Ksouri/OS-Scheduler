// Include/AlgorithmCache.h
#ifndef ALGORITHM_CACHE_H
#define ALGORITHM_CACHE_H

#include <time.h>
#include <pthread.h>

typedef struct {
    char name[50];
    char display_name[100];
    int has_quantum;
    int has_priority;
    int has_cpu_limit;
} AlgorithmInfo;

typedef struct {
    AlgorithmInfo *algorithms;
    int count;
    time_t last_scan;
    pthread_mutex_t lock;
} AlgorithmCache;

/**
 * Get cached algorithms or scan if cache is expired
 * 
 * @param schedulers_path Path to the schedulers directory
 * @param count Output parameter for number of algorithms found
 * @return Array of AlgorithmInfo (must be freed by caller)
 */
AlgorithmInfo* GetCachedAlgorithms(const char *schedulers_path, int *count);

/**
 * Initialize the algorithm cache
 */
void InitAlgorithmCache(void);

/**
 * Cleanup the algorithm cache
 */
void CleanupAlgorithmCache(void);

#endif // ALGORITHM_CACHE_H