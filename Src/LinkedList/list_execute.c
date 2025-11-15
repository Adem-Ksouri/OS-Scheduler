
#include <stdlib.h>
#include "../../Include/linked_list_execute.h"

void add_head(e_list *l, execute e){
    if (l == NULL) return;

    e_node* nw = (e_node*)malloc(sizeof(e_node));
    if (!nw) return;

    nw->e.p = e.p;
    nw->e.events = e.events;
    (nw->e).ts = e.ts;
    (nw->e).te = e.te;
    nw->prev = NULL;
    nw->suiv = l->head;
    
    if (l->sz == 0){ 
        l->head = l->tail = nw;
    }else {
        l->head->prev = nw;
        l->head = nw;
    }
    l->sz++;
}

void add_tail(e_list *l, execute e) {
    if (l == NULL) return;
    e_node* nw = (e_node*)malloc(sizeof(e_node));
    if (!nw) return;

    nw->e.p = e.p;
    nw->e.events = e.events;
    (nw->e).ts = e.ts;
    (nw->e).te = e.te;

    if (l == NULL){
        l = (e_list*)malloc(sizeof(e_list));  
        l->head = l->tail = nw;
    }else {
        l->tail->suiv = nw;
        l->tail = nw;
    }
    l->sz++;
}

void del_head(e_list *l){
    if (l == NULL || l->sz == 0) 
        return;
    if (l->sz == 1){
        l->head = l->tail = NULL;
        l->sz = 0;
    }else {
        l->head = l->head->suiv;
        l->sz--;
    }
}

void del_tail(e_list *l){
    if (l == NULL || l->sz == 0) 
        return;
    if (l->sz == 1){
        l->head = l->tail = NULL;
        l->sz = 0;
    }else {
        l->tail = l->tail->prev;
        l->sz--;
    }
}

int getsz(e_list *l){
    return l->sz;
}