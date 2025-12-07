#ifndef QUEUE_H
#define QUEUE_H

#include "List.h"

typedef list* queue;

queue create_queue();
queue push(queue q, void* dataToPush);
queue pop(queue q);
void* front(queue q);
int size(queue q);

#endif