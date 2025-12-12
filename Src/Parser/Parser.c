#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "../../Include/Utils.h"

#define MAX_PROC 100
#define MAX_LINE 256

int parser(FILE *f, process* tab, int *nbProc) {
    char line[MAX_LINE];
    *nbProc = 0;
    
    while (fgets(line, sizeof(line), f)) {
        if (*nbProc >= MAX_PROC) {
            return -1; 
        }
        
        line[strcspn(line, "\n")] = '\0';
        
        char *line_ptr = line;
        while (isspace((unsigned char)*line_ptr)) 
            line_ptr++;
        
    
        if (*line_ptr == '#' || *line_ptr == '\0')
            continue;
        
        char name[20];
        int arrival, exec_time, priority, nbEvents;
        
        int parsed = sscanf(line_ptr, "%s %d %d %d %d", name, &arrival, &exec_time, &priority, &nbEvents);
        if (parsed != 5) {
            return -1; // Format error
        }

        tab[*nbProc].pid = *nbProc + 1;
        tab[*nbProc].ppid = 0;
        strcpy(tab[*nbProc].name, name);
        tab[*nbProc].arrival = arrival;
        tab[*nbProc].exec_time = exec_time;
        tab[*nbProc].rem_time = exec_time; 
        tab[*nbProc].priority = priority;
        tab[*nbProc].nbEvents = nbEvents;
        tab[*nbProc].cpu_usage = 0;
        
        if (nbEvents == 0) {
            tab[*nbProc].events = NULL;
        } else {
            tab[*nbProc].events = (event*)malloc(nbEvents * sizeof(event));
            if (tab[*nbProc].events == NULL) {
                return -1; // Memory allocation error
            }
            
            char line_copy[MAX_LINE];
            strcpy(line_copy, line_ptr);
            
            char *token = strtok(line_copy, " \t");
            for (int i = 0; i < 5 && token != NULL; i++) {
                token = strtok(NULL, " \t");
            }
            
            for (int event_idx = 0; event_idx < nbEvents; event_idx++) {
                if (token == NULL) {
                    free(tab[*nbProc].events);
                    return -1; // Not enough tokens for events
                }
                
                tab[*nbProc].events[event_idx].t = atoi(token);
                token = strtok(NULL, " \t");
                
                if (token == NULL) {
                    free(tab[*nbProc].events);
                    return -1; // Missing comment
                }
                
                strcpy(tab[*nbProc].events[event_idx].comment, token);
                token = strtok(NULL, " \t");
            }
        }
        
        (*nbProc)++;
    }
    
    return 0;
}
