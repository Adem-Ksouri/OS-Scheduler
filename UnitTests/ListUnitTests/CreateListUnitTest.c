#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include "../../Include/List.h"

int main(){
    list* l = create_list();

    assert(l->sz == 0);
    assert(l->head == NULL);
    assert(l->tail == NULL);
}