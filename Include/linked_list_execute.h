#ifndef LINKED_p_list_H
#define LINKED_p_list_H

#include "utils.h"

typedef struct e_node {
    execute e;
    struct e_node* prev;
    struct e_node* suiv;
} e_node;

typedef struct e_list{
    int sz;
    e_node* head;
    e_node* tail;
} e_list;

void add_head(e_list *l, execute e_add);
void add_tail(e_list *l, execute e_add);
void del_head(e_list *l);
void del_tail(e_list *l);
int getsz(e_list *l);

#endif