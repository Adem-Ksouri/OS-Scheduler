#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "../../Include/Utils.h"
#define MAX_PROC 100
#define MAX_LINE 256


int parser(FILE *f, process* tab, int *nbProc) {
    char line[256];

    while (fgets(line, sizeof(line), f)) {

        if (*nbProc >= MAX_PROC) {
            fprintf(stderr, "Maximum number of processes reached\n");
            return -1;
        }

        line[strcspn(line, "\n")] = '\0';

        char *line1 = line;
        while (isspace((unsigned char)*line1)) 
            line1++;

        if (*line1 == '#' || *line1 == '\0')
            continue;

        char name[20];
        int arrival, exec_time, priority;

        if (sscanf(line1, "%s %d %d %d", name, &arrival, &exec_time, &priority) == 4) {
            tab[*nbProc].pid = *nbProc + 1;
            tab[*nbProc].ppid = 0;
            strcpy(tab[*nbProc].name, name);
            tab[*nbProc].arrival = arrival;
            tab[*nbProc].exec_time = exec_time;
            tab[*nbProc].rem_time = exec_time; 
            tab[*nbProc].priority = priority;
            tab[*nbProc].nbEvents = 0;
            tab[*nbProc].events = NULL;

            (*nbProc)++;
        } else {
            fprintf(stderr, "format incorrect : %s\n", line1);
        }
    }

    return 0;
}
