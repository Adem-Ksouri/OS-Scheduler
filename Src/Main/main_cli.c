#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "../../Include/Utils.h"
#include "../../Include/Parser.h"
#include "../../Include/Scheduler.h"

int main(int argc, char *argv[]) {
    if (argc < 3) {
        fprintf(stderr, "Usage: %s <config_file> <algorithm> [quantum] [cpu_limit] [nb_priority]\n", argv[0]);
        fprintf(stderr, "\nExamples:\n");
        fprintf(stderr, "  %s config.txt Fifo\n", argv[0]);
        fprintf(stderr, "  %s config.txt RoundRobin 2\n", argv[0]);
        fprintf(stderr, "  %s config.txt Multilevel 2 3 20\n", argv[0]);
        return 1;
    }
    FILE *f = fopen(argv[1], "r");
    if (!f) {
        fprintf(stderr, "Error: Cannot open config file: %s\n", argv[1]);
        return 1;
    }
    
    process* processes = (process*)malloc(sizeof(process) * 100);
    if (!processes) {
        fprintf(stderr, "Error: Memory allocation failed\n");
        fclose(f);
        return 1;
    }
    
    int nbProc = 0;
    if (parser(f, processes, &nbProc) != 0) {
        fprintf(stderr, "Error: Failed to load processes from config file\n");
        fclose(f);
        free(processes);
        return 1;
    }
    fclose(f);
    
    char* choice = argv[2];  
    int quantum = (argc >= 4) ? atoi(argv[3]) : 2;
    int cpu_usage_limit = (argc >= 5) ? atoi(argv[4]) : 3;
    int nbPriority = (argc >= 6) ? atoi(argv[5]) : 20;
    execute* result = NULL;
    int out_cnt = 0;
    char* algo_name = choice;
    
    if (strcmp(choice, "Fifo") == 0) {
        result = fifo_scheduler(processes, nbProc, &out_cnt);
    }
    else if (strcmp(choice, "RoundRobin") == 0) {
        result = rr_scheduler(processes, nbProc, quantum, &out_cnt);
    }
    else if (strcmp(choice, "PreemptivePriority") == 0) {
        result = pp_scheduler(processes, nbProc, &out_cnt);
    }
    else if (strcmp(choice, "Multilevel") == 0) {
        result = multilevel_scheduler(processes, nbProc, nbPriority, &out_cnt, cpu_usage_limit);
    }
    else {
        fprintf(stderr, "Error: Unknown algorithm: %s\n", choice);
        fprintf(stderr, "Available: Fifo, RoundRobin, PreemptivePriority, Multilevel\n");
        free(processes);
        return 1;
    }
    
    if (!result) {
        fprintf(stderr, "Error: Scheduler returned null\n");
        free(processes);
        return 1;
    }
  
    printf("{\n");
    printf("  \"success\": true,\n");
    printf("  \"algorithm\": \"%s\",\n", algo_name);
    printf("  \"totalProcesses\": %d,\n", nbProc);
    printf("  \"executes\": [\n");
    
    for (int i = 0; i < out_cnt; i++) {
        printf("    {\n");
        
    
        printf("      \"p\": {\n");
        printf("        \"pid\": %d,\n", result[i].p->pid);
        printf("        \"ppid\": %d,\n", result[i].p->ppid);
        printf("        \"name\": \"%s\",\n", result[i].p->name);
        printf("        \"arrival\": %d,\n", result[i].p->arrival);
        printf("        \"exec_time\": %d,\n", result[i].p->exec_time);
        printf("        \"rem_time\": %d,\n", result[i].p->rem_time);
        printf("        \"cpu_usage\": %d,\n", result[i].p->cpu_usage);
        printf("        \"priority\": %d,\n", result[i].p->priority);
        printf("        \"nbEvents\": %d,\n", result[i].p->nbEvents);
        
        printf("        \"events\": [\n");
        for (int j = 0; j < result[i].p->nbEvents; j++) {
            printf("          {\n");
            printf("            \"t\": %d,\n", result[i].p->events[j].t);
            printf("            \"comment\": \"%s\"\n", result[i].p->events[j].comment);
            printf("          }");
            if (j < result[i].p->nbEvents - 1) printf(",");
            printf("\n");
        }
        printf("        ]\n");
        printf("      },\n");
        
       
        printf("      \"ts\": %d,\n", result[i].ts);
        printf("      \"te\": %d,\n", result[i].te);
        
        printf("      \"event_count\": %d,\n", result[i].event_count);
        
       
        printf("      \"events\": [\n");
        for (int j = 0; j < result[i].event_count; j++) {
            printf("        {\n");
            printf("          \"t\": %d,\n", result[i].events[j].t);
            printf("          \"comment\": \"%s\"\n", result[i].events[j].comment);
            printf("        }");
            if (j < result[i].event_count - 1) printf(",");
            printf("\n");
        }
        printf("      ]\n");
        
        printf("    }");
        if (i < out_cnt - 1) printf(",");
        printf("\n");
    }
    
    printf("  ]\n");
    printf("}\n");
    
    
    free(processes);
    
    return 0;
}