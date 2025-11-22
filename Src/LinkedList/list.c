#include <stdlib.h>
#include "../../Include/list.h"

list* create_list(){
    list* l = (list*)malloc(sizeof(list));
    l->sz = 0;
    l->head = l->tail = NULL;
    return l;
}

void add_head(list *l, void *dataToAdd){
    if (l == NULL) return;

    node* nw = (node*)malloc(sizeof(node));
    if (!nw) return;

    nw->data = dataToAdd;
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

void add_tail(list *l, void *dataToAdd) {
    if (l == NULL) return;

    node* nw = (node*)malloc(sizeof(node));
    if (!nw) return;

    nw->data = dataToAdd;
    nw->prev = NULL;
    nw->suiv = l->head;

    if (l->sz == 0){
        l->head = l->tail = nw;
    }else {
        l->tail->suiv = nw;
        l->tail = nw;
    }
    l->sz++;
}

void del_head(list *l){
    if (l == NULL || l->sz == 0) 
        return;
    if (l->sz == 1){
        l->head = l->tail = NULL;
    }else {
        l->head = l->head->suiv;
        l->head->prev = NULL;
    }
    l->sz--;
}

void del_tail(list *l){
    if (l == NULL || l->sz == 0) 
        return;
    if (l->sz == 1){
        l->head = l->tail = NULL;
    }else {
        l->tail = l->tail->prev;
        l->tail->suiv = NULL;
    }
    l->sz--;
}

int getsz(list *l){
    return l->sz;
}