#ifndef LINKED_LIST_PROCESS_H
#define LINKED_LIST_PROCESS_H

#include "utils.h"

typedef struct p_node{
    process p;
    struct p_node* prev;
    struct p_node* suiv;
} p_node;

typedef struct p_list{
    int sz;
    p_node* head;
    p_node* tail;
} p_list;

void add_head(p_list *l, process p_add);
void add_tail(p_list *l, process p_add);
void del_head(p_list *l);
void del_tail(p_list *l);
int getsz(p_list *l);

#endif