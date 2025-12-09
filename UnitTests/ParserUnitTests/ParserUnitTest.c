#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <unistd.h>
#include <limits.h>
#include "../../Include/Utils.h"
#include "../../Include/Parser.h"
#include "../../Include/ProjectPathGetter.h"

int main() { 
    char* pjPath = getProjectPath();
    char* outputFilePath = strcat(pjPath, "/UnitTest/TestsOutput/Parser.txt");    
    freopen(outputFilePath, "w", stdout);
    
    char* configFileInput = strcat(pjPath, "/UnitTests/TestFiles/config.txt");
    
    printf("%s\n", outputFilePath);
    printf("%s\n", configFileInput);

    FILE *f = fopen(configFileInput, "r");
    if (!f) {
        perror("Unable to open folder");
        return -1;
    }

    process tab[100];
    int nbProc = 0;

    int ret = parser(f, tab, &nbProc);
    printf("%d \n", ret);

    for (int i = 0; i < nbProc; i++) {
        printf("PID: %d | Name: %s | Arrival: %d | Exec: %d | Priority: %d\n",tab[i].pid, tab[i].name, tab[i].arrival, tab[i].exec_time, tab[i].priority);
    }

    printf("Parser test passed!\n");
    fclose(f);
    return 0;
}
