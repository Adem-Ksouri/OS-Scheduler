#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <dirent.h>
#include <unistd.h>
#include "../../Include/Utils.h"
#include "../../Include/Parser.h"
#include "../../Include/Scheduler.h"
#include "../../Include/SchedulersGetter.h"
#include <microhttpd.h>
#include <stdlib.h>

#define PORT 8080

// Structure to accumulate POST data
struct RequestData {
    char body[4096];
};


// Handle request
static int handle_request(
    void *cls,
    struct MHD_Connection *connection,
    const char *url,
    const char *method,
    const char *version,
    const char *upload_data,
    size_t *upload_data_size,
    void **con_cls)
{
    // First call: allocate memory
    if (*con_cls == NULL) {
        struct RequestData *data = calloc(1, sizeof(struct RequestData));
        *con_cls = data;
        return MHD_YES;
    }
    char cwd[100];
    if (getcwd(cwd, sizeof(cwd)) == NULL) {
        perror("getcwd");
    } 

    char* schedulersFolder = strcat(cwd, "/Schedulers");
    
    char* choice = malloc(50 * sizeof(char));
    if (!choice) {
        perror("malloc failed");
        exit(1);
    }
    
    struct RequestData *req = *con_cls;
    
    // If POST data is still coming, copy it
    if (*upload_data_size != 0) {
        strncat(req->body, upload_data, *upload_data_size);
        *upload_data_size = 0;
        return MHD_YES;
    }
    // PROCESS REQUEST
    char response[4096] = {0};
    
    if (strcmp(method, "POST") == 0) {
        FILE *f = fopen("/home/wael/Documents/SE-TP/OS-Scheduler/UnitTests/TestFiles/config.txt", "w+");
        
        fwrite(req->body, sizeof(char), strlen(req->body), f);
        // Move file pointer back to start before reading
        rewind(f);

        process* processes = (process*)malloc(sizeof(process) * 100);
        int nbProc = 0;
        if (parser(f, processes, &nbProc) != 0) {
            fprintf(stderr, "Failed to load processes from config file\n");
            return 1;
        }
        choice = url+1;
     
        execute* result;
        int out_cnt = 0;
        int quantum = 2;
        int cpu_usage_limit = 3;
        int nbPriority = 20;
        if (strcmp(choice, "Fifo") == 0 || strcmp(choice, "1") == 0){
            result = fifo_scheduler(processes, nbProc, &out_cnt);
        }else if (strcmp(choice, "RoundRobin") == 0 || strcmp(choice, "4") == 0){
            printf("Enter the quantum value: ");
            scanf("%d", &quantum);
            printf("\n");
            result = rr_scheduler(processes, nbProc, quantum, &out_cnt);
        }else if (strcmp(choice, "PreemptivePriority") == 0 || strcmp(choice, "2") == 0){
            result = pp_scheduler(processes, nbProc, &out_cnt);
        }else if (strcmp(choice, "Multilevel") == 0 || strcmp(choice, "3") == 0) {
            printf("Enter the number of levels: ");
            scanf("%d", &nbPriority);
            printf("\n");
            printf("Enter the cpu usage limit: ");
            scanf("%d", &cpu_usage_limit);
            printf("\n");
            result = multilevel_scheduler(processes, nbProc, nbPriority, &out_cnt, cpu_usage_limit);
        }else {
            result = fifo_scheduler(processes, nbProc, &out_cnt);
        }
    
        printf("\n");
        printf("Running %s algorithm :\n", choice);
    
        printf("Result:\n");
        for (int i = 0; i < out_cnt; i++){
            printf("Process: %s | From: %d To: %d \n", result[i].p->name, result[i].ts, result[i].te);
            sleep(1);
        }
    }
    // Create HTTP response
    struct MHD_Response *res =
        MHD_create_response_from_buffer(strlen(response),
                                        strdup(response),
                                        MHD_RESPMEM_MUST_FREE);

    int ret = MHD_queue_response(connection, MHD_HTTP_OK, res);
    MHD_destroy_response(res);
    free(req);
    *con_cls = NULL;
    return ret;
}


int main(int argc, char *argv[]) {
    //server ::: 
    struct MHD_Daemon *server;

    server = MHD_start_daemon(
        MHD_USE_INTERNAL_POLLING_THREAD,
        PORT,
        NULL, NULL,
        &handle_request, NULL,
        MHD_OPTION_END
    );

    if (!server) {
        printf("Failed to start server.\n");
        return 1;
    }

    printf("Server running on http://localhost:%d\n", PORT);
    getchar(); // Keep running
    MHD_stop_daemon(server);

    return 0;
}
