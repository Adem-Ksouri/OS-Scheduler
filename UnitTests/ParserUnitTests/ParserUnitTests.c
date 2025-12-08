#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "../../Include/Utils.h"
#include "../../Include/Parser.h"

int main() {
    const char *filename = "C:/Users/selma/Desktop/config.txt";
    process tab[100];
    int nbProc = 0;

    int ret = parser(filename, tab, &nbProc);
    assert(ret == 0);

    for (int i = 0; i < nbProc; i++) {
        printf("PID: %d | Name: %s | Arrival: %d | Exec: %d | Priority: %d\n",tab[i].pid, tab[i].name, tab[i].arrival, tab[i].exec_time, tab[i].priority);
    }

    printf("Parser test passed!\n");
    return 0;
}
