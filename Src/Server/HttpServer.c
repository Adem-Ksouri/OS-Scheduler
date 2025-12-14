#include <stdio.h>
#include <stdlib.h>
#include <microhttpd.h>
#include "../../Include/HttpServer.h"
#include "../../Include/RequestHandler.h"

#define PORT 8080
#define THREAD_POOL_SIZE 4

int StartHttpServer(void) {
    struct MHD_Daemon *daemon;
    
    printf("Starting HTTP server on port %d...\n", PORT);
    
    daemon = MHD_start_daemon(
        MHD_USE_INTERNAL_POLLING_THREAD,
        PORT,
        NULL, NULL,
        &HandleRequest, NULL,
        MHD_OPTION_NOTIFY_COMPLETED, RequestCompleted, NULL,
        MHD_OPTION_THREAD_POOL_SIZE, THREAD_POOL_SIZE,
        MHD_OPTION_END
    );
    
    if (!daemon) {
        fprintf(stderr, "Failed to start server on port %d\n", PORT);
        return 1;
    }
    
    printf("Server running. Press Enter to stop...\n");
    
    getchar();
    
    printf("Shutting down server...\n");
    MHD_stop_daemon(daemon);
    
    printf("Server stopped.\n");
    
    return 0;
}