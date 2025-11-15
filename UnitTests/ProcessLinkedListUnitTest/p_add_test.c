#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include "../../Include/helpers.h"
#include "../../Include/linked_list_process.h"

int main(){
    process p_test1 = getProcessForTest(4);

    p_list l = {
        .head = NULL,
        .tail = NULL,
        .sz = 0,
    };

    add_head(&l, p_test1);

    assert(l.sz == 1);
    assert(l.head != NULL);
    assert(l.head->p.pid == 4);

    process p_test2 = getProcessForTest(2);
    add_head(&l, p_test2);
    
    assert(l.sz == 2);
    assert(l.head != NULL);
    assert(l.tail != NULL);
    assert(l.head->p.pid == 2);
    assert((l.head)->suiv->p.pid == 4);
}