#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "../Include/Utils.h"
#include "../Include/Parser.h"

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "You need to pass only the config file in parameter\n");
        return 1;
    }

    process tab[100];
    int nbProc;

    if (parser(argv[1], tab, &nbProc) != 0) {
        fprintf(stderr, "Failed to load processes from cofig file\n");
        return 1;
    }

    for (int i = 0; i < nbProc; i++)
        printf("%s %d %d %d\n", tab[i].name, tab[i].arrival, tab[i].exec_time, tab[i].priority);

    return 0;
}
