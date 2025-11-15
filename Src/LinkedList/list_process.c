
#include <stdlib.h>
#include "../../Include/linked_list_process.h"

void add_head(p_list *l, process p){
    if (l == NULL) return;

    p_node* nw = (p_node*)malloc(sizeof(p_node));
    if (!nw) return;

    nw->p.pid = p.pid;
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

void add_tail(p_list *l, process p) {
    p_node* nw = (p_node*)malloc(sizeof(p_node));
    if (!nw) return;

    nw->p = p;
    nw->prev = NULL;
    nw->suiv = l->head;

    if (l == NULL){
        l = (p_list*)malloc(sizeof(p_list));  
        l->head = l->tail = nw;
    }else {
        l->tail->suiv = nw;
        l->tail = nw;
    }
    l->sz++;
}

void del_head(p_list *l){
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

void del_tail(p_list *l){
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

int getsz(p_list *l){
    return l->sz;
}