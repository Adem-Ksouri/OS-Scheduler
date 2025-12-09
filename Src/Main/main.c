#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <dirent.h>
#include <unistd.h>
#include "../../Include/Utils.h"
#include "../../Include/Parser.h"
#include "../../Include/Scheduler.h"
#include "../../Include/SchedulersGetter.h"

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "You need to pass only the config file in parameter\n");
        return 1;
    }

    FILE *f = fopen(argv[1], "r");

    process* processes = (process*)malloc(sizeof(process) * 100);
    int nbProc = 0;
    if (parser(f, processes, &nbProc) != 0) {
        fprintf(stderr, "Failed to load processes from config file\n");
        return 1;
    }

    char* algo = GetSchedulers();
    printf("Please choose an algorithm :)\n");
    printf("%s", algo);
    printf("\n");
    char* choice = malloc(50 * sizeof(char));
    if (!choice) {
        perror("malloc failed");
        exit(1);
    }
    
    printf("Enter your choice here: \n");
    scanf("%49s", choice);

    execute* result;
    int out_cnt = 0;
    int quantum = 2;
    int cpu_usage_limit = 3;
    int nbPriority = 20;
    if (strcmp(choice, "Fifo") == 0){
        result = fifo_scheduler(processes, nbProc, &out_cnt);
    }else if (strcmp(choice, "RoundRobin") == 0){
        printf("Enter the quantum value: ");
        scanf("%d", &quantum);
        printf("\n");
        result = rr_scheduler(processes, nbProc, quantum, &out_cnt);
    }else if (strcmp(choice, "PreemptivePriority") == 0){
        result = pp_scheduler(processes, nbProc, &out_cnt);
    }else if (strcmp(choice, "Multilevel") == 0) {
        printf("Enter the number of levels: ");
        scanf("%d", &nbPriority);
        printf("\n");
        printf("Enter the cpu usage limit: ");
        scanf("%d", &cpu_usage_limit);
        printf("\n");
        result = multilevel_scheduler(processes, nbProc, nbPriority, &out_cnt, cpu_usage_limit);
    }else {
        result = fifo_scheduler(processes, nbProc, &out_cnt);
    }

    printf("\n");
    printf("Running %s algorithm :\n", choice);

    printf("Result:\n");
    for (int i = 0; i < out_cnt; i++){
        printf("Process: %s | From: %d To: %d \n", result[i].p->name, result[i].ts, result[i].te);
        sleep(1);
    }
    
    free(choice);
    return 0;
}
