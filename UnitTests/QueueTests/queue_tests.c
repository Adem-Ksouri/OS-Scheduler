#include <assert.h>
#include "../../Include/helpers.h"
#include "../../Include/queue.h"

int main(){
    queue q = create_queue();
    
    process* p1 = getDefaultProcessForTest(2);
    q = push(q, p1);
    assert(size(q) == 1);

    process* p2 = front(q);
    assert(p1->pid == p2->pid);

    q = pop(q);
    assert(size(q) == 0);

    return 0;
}