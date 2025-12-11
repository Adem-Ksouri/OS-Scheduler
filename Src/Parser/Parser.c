#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "../../Include/Utils.h"

#define MAX_PROC 100
#define MAX_LINE 256

int parser(FILE *f, process* tab, int *nbProc) {
    char line[256];
    *nbProc = 0;
    
    while (fgets(line, sizeof(line), f)) {
        if (*nbProc >= MAX_PROC) {
            fprintf(stderr, "Maximum number of processes reached\n");
            return -1;
        }
        
        line[strcspn(line, "\n")] = '\0';
        
        char *line1 = line;
        while (isspace((unsigned char)*line1)) 
            line1++;
        
        // Skip comments and empty lines
        if (*line1 == '#' || *line1 == '\0')
            continue;
        
        char name[20];
        int arrival, exec_time, priority, nbEvents;
        
        // Parse the first 5 fields
        int parsed = sscanf(line1, "%s %d %d %d %d", name, &arrival, &exec_time, &priority, &nbEvents);
        
        if (parsed == 5) {
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
                // Allocate memory for events
                tab[*nbProc].events = (event*)malloc(nbEvents * sizeof(event));
                if (tab[*nbProc].events == NULL) {
                    fprintf(stderr, "Memory allocation failed for events\n");
                    return -1;
                }
                
                // Find position after first 5 fields using strtok
                char line_copy[256];
                strcpy(line_copy, line1);
                
                char *token = strtok(line_copy, " \t");
                for (int field = 0; field < 5 && token != NULL; field++) {
                    token = strtok(NULL, " \t");
                }
                
                // Now parse the events
                int event_idx = 0;
                while (token != NULL && event_idx < nbEvents) {
                    // Parse time
                    int event_time = atoi(token);
                    token = strtok(NULL, " \t");
                    
                    if (token == NULL) {
                        fprintf(stderr, "Missing event comment for process %s\n", name);
                        free(tab[*nbProc].events);
                        return -1;
                    }
                    
                    // Parse comment
                    tab[*nbProc].events[event_idx].t = event_time;
                    strcpy(tab[*nbProc].events[event_idx].comment, token);
                    
                    event_idx++;
                    token = strtok(NULL, " \t");
                }
                
                if (event_idx != nbEvents) {
                    fprintf(stderr, "Warning: Expected %d events but parsed %d for process %s\n", 
                            nbEvents, event_idx, name);
                }
            }
            
            (*nbProc)++;
        } else {
            fprintf(stderr, "format incorrect (parsed %d fields): %s\n", parsed, line1);
        }
    }
    return 0;
}