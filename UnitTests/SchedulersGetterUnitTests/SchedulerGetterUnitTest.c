#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include "../../Include/SchedulersGetter.h"

int main() {
    // freopen("TestsOutput/SchedulersGetter.txt", "w", stdout);

    char* algo = GetSchedulers();
    printf("%s", algo);
    
    return 0;
}