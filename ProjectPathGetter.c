#include <stdlib.h>
#include "Include/ProjectPathGetter.h"


char* getProjectPath(){
    char cwd[512]; 
    if (getcwd(cwd, sizeof(cwd)) != NULL) {
        char* result = malloc(strlen(cwd) + 1);
        strcpy(result, cwd);
        return result;
    }    
    perror("getcwd() error");
    return "";
}