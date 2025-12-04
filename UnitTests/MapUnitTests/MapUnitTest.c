#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include "../../Include/Helpers.h"
#include "../../Include/Map.h"

int main(){
    map* mp = map_init();
    assert(mp != NULL);

    process* p1 = getDefaultProcessForTest(2);
    int time_exec = 5;

    map_set(mp,p1->pid,time_exec);

    int size = map_get_size(mp);
    assert(size == 1);

    int val = map_get_value(mp,p1->pid);
    assert(val == 5);
    
    return 0;
}