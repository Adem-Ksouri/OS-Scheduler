#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include "../../Include/helpers.h"
#include "../../Include/list.h"

int main(){
    list* l = create_list();

    process* p_test1 = getDefaultProcessForTest(4);
    add_head(l, p_test1);

    assert(l->sz == 1);
    assert(l->head != NULL);
    assert(((process*)l->head->data)->pid == 4);

    process* p_test2 = getDefaultProcessForTest(2);
    add_head(l, p_test2);
    
    assert(l->sz == 2);
    assert(l->head != NULL);
    assert(l->tail != NULL);
    assert(((process*)l->head->data)->pid == 2);
    assert(((process*)l->head->suiv->data)->pid == 4);

    return 0;
}