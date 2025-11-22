#ifndef MAP_H
#define MAP_H

#include <stdlib.h>

typedef struct {
    int key;
    int value;
} map_entry;

typedef struct {
    map_entry *items;
    int size;
    int capacity;
} map;


map* map_init();
int map_get_value(map* m, int key);
void map_set(map* m, int key, int value);
int map_get_size(map* m);

#endif