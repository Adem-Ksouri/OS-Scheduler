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
        fprintf(stderr, "too less or much arguments than expected\n");
        return 1;
    }

    char cwd[100];
    if (getcwd(cwd, sizeof(cwd)) == NULL) {
        perror("getcwd");
    } 
    char* schedulersFolder = strcat(cwd, "/Schedulers");

    FILE *f = fopen(argv[1], "r");

    process* processes = (process*)malloc(sizeof(process) * 100);
    int nbProc = 0;
    if (parser(f, processes, &nbProc) != 0) {
        fprintf(stderr, "Failed to load processes from config file\n");
        return 1;
    }

    char* algo = GetSchedulers(schedulersFolder);
    printf("Please choose an algorithm :)\n");
    printf("%s", algo);
    printf("\n");
    char* choice = malloc(50 * sizeof(char));
    if (!choice) {
        perror("malloc failed");
        exit(1);
    }
    
    printf("Enter your choice here: \n");
    fgets(choice, 50, stdin);

    execute* result;
    int out_cnt = 0;
    int quantum = 2;
    int cpu_usage_limit = 3;
    int nbPriority = 20;
    if (strcmp(choice, "Fifo\n") == 0){
        result = fifo_scheduler(processes, nbProc, &out_cnt);
    }else if (strcmp(choice, "RoundRobin\n") == 0){
        printf("Enter the quantum value: ");
        scanf("%d", &quantum);
        printf("\n");
        result = rr_scheduler(processes, nbProc, quantum, &out_cnt);
    }else if (strcmp(choice, "PreemptivePriority\n") == 0){
        result = pp_scheduler(processes, nbProc, &out_cnt);
    }else if (strcmp(choice, "Multilevel\n") == 0) {
        printf("Enter the number of levels: ");
        scanf("%d", &nbPriority);
        printf("\n");
        printf("Enter the cpu usage limit: ");
        scanf("%d", &cpu_usage_limit);
        printf("\n");
        result = multilevel_scheduler(processes, nbProc, nbPriority, &out_cnt, cpu_usage_limit);
    }else {
        choice = "Fifo";
        result = fifo_scheduler(processes, nbProc, &out_cnt);
    }

    printf("\n");
    printf("Running %s algorithm :\n", choice);

    printf("Result:\n");
    for (int i = 0; i < out_cnt; i++){
        printf("Process: %s | From: %d To: %d \n", result[i].p->name, result[i].ts, result[i].te);
        printf("number of events is %d :\n", result[i].event_count);
        for (int j = 0; j < result[i].event_count; j++)
            printf("%d %s\n",result[i].events[j].t, result[i].events[j].comment);
        printf("\n");
        sleep(1);
    }
    
    free(choice);
    return 0;
}
