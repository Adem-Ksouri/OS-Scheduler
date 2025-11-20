#include "../../Include/queue.h"

queue create_queue(){
    return create_list();
}

queue push(queue q, void* dataToPush){
    add_tail(q, dataToPush);
    return q;
}

queue pop(queue q){
    del_head(q);
    return q;
}

void* front(queue q){
    return q->head->data;
}

int size(queue q){
    return q->sz;
}