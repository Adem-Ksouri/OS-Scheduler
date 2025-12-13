// Src/Main/main_server.c
#include <stdio.h>
#include <string.h>
#include "../../Include/HttpServer.h"

int main(int argc, char *argv[]) {
    // Vérifier l'argument --server
    if (argc != 2 || strcmp(argv[1], "--server") != 0) {
        fprintf(stderr, "Usage: %s --server\n", argv[0]);
        fprintf(stderr, "\nThis program starts an HTTP server on port 8080\n");
        fprintf(stderr, "that receives scheduling requests from a web frontend.\n");
        return 1;
    }
    
    // Démarrer le serveur HTTP
    return StartHttpServer();
}