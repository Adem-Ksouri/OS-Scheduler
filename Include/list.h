#ifndef LIST_H
#define LIST_H

#include "utils.h"

typedef struct node{
    void* data;
    struct node* prev;
    struct node* suiv;
} node;

typedef struct list{
    int sz;
    node* head;
    node* tail;
} list;

list* create_list();
void add_head(list *l, void *dataToAdd);
void add_tail(list *l, void *dataToAdd);
void del_head(list *l);
void del_tail(list *l);
void* get_head(list *l);
void* get_tail(list *l);
int getsz(list *l);

#endif