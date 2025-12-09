#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <sys/types.h>

char* GetSchedulers() {
    const char *folder = "/home/adem/Desktop/Github/OS-Scheduler/Src/Schedulers"; 
    DIR *d = opendir(folder);
    if (d == NULL) {
        printf("Unable to open directory\n");
        return NULL;
    }

    struct dirent *dir;
    size_t totalLen = 1;
    char* result = malloc(totalLen);
    result[0] = '\0'; 

    while ((dir = readdir(d)) != NULL) {
        if (dir->d_name[0] == '.' && 
            (dir->d_name[1] == '\0' || 
             (dir->d_name[1] == '.' && dir->d_name[2] == '\0'))) {
            continue;
        }

        size_t nameLen = strlen(dir->d_name);
        totalLen += nameLen + 1; 
        result = realloc(result, totalLen);
        strcat(result, dir->d_name);
        strcat(result, "\n");
    }

    closedir(d);
    return result;
}
