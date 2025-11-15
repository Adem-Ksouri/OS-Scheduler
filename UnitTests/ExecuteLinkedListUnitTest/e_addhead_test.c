#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include "../../Include/helpers.h"
#include "../../Include/linked_list_execute.h"

int main(){
    execute e1 = getExecuteForTest(4, 2, 3);

    e_list l = {
        .head = NULL,
        .tail = NULL,
        .sz = 0,
    };

    add_head(&l, e1);

    assert(l.sz == 1);
    assert(l.head != NULL);
    assert(l.head->e.p.pid == 4);
    assert(l.head->e.ts == 2);
    assert(l.head->e.te == 3);

    execute e2 = getExecuteForTest(2, 3, 6);
    add_head(&l, e2);
    
    assert(l.sz == 2);
    assert(l.head != NULL);
    assert(l.tail != NULL);
    assert(l.head->e.p.pid == 2);
    assert(l.head->e.ts == 3);
    assert(l.head->e.te == 6);
    assert((l.head)->suiv->e.p.pid == 4);
    assert((l.head)->suiv->e.ts == 2);
    assert((l.head)->suiv->e.te == 3);
}