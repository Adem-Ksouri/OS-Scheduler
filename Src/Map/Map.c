#include <stdlib.h>
#include "../../Include/Map.h"

map* map_init() {
    map* m = malloc(sizeof(map));
    if (!m) return NULL;

    m->size = 0;
    m->capacity = 2;
    m->items = malloc(sizeof(map_entry) * m->capacity);
    return m;
}


int map_get_value(map* m, int key) {
    for (int i = 0; i < m->size; i++) {
        if (m->items[i].key == key) {
            return m->items[i].value;
        }
    }
    return 0;
}

void map_set(map *m, int key, int value) {
    for (int i = 0; i < m->size; i++) {
        if (m->items[i].key == key) {
            m->items[i].value = value;
            return;
        }
    }
    
    if (m->size == m->capacity) {
        m->capacity *= 2;
        m->items = realloc(m->items, sizeof(map_entry) * m->capacity);
    }

    m->items[m->size].key = key;
    m->items[m->size].value = value;
    m->size++;
}


int map_get_size(map *m) {
    return m->size;
}