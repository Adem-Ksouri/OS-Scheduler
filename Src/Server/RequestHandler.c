#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <microhttpd.h>
#include "../../Include/RequestHandler.h"
#include "../../Include/ResponseUtils.h"
#include "../../Include/SchedulerExecutor.h"

#define PORT 8080
#define MAX_UPLOAD_SIZE (100 * 1024)

enum MHD_Result HandleRequest(
    void *cls,
    struct MHD_Connection *connection,
    const char *url,
    const char *method,
    const char *version,
    const char *upload_data,
    size_t *upload_data_size,
    void **con_cls
) {
    struct MHD_Response *response;
    enum MHD_Result ret;
    int status_code = MHD_HTTP_OK;
    
    if (strcmp(method, "OPTIONS") == 0) {
        response = MHD_create_response_from_buffer(0, "", MHD_RESPMEM_PERSISTENT);
        AddCorsHeaders(response);
        ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        return ret;
    }
    
    if (strcmp(method, "POST") == 0 && strcmp(url, "/api/schedule") == 0) {
        struct ConnectionInfo *con_info = *con_cls;
        
        if (!con_info) {
            con_info = malloc(sizeof(struct ConnectionInfo));
            if (!con_info) return MHD_NO;
            
            con_info->data = NULL;
            con_info->size = 0;
            *con_cls = con_info;
            return MHD_YES;
        }
        
        if (*upload_data_size > 0) {
            if (con_info->size + *upload_data_size > MAX_UPLOAD_SIZE) {
                char *error = CreateErrorResponse("Request too large");
                response = MHD_create_response_from_buffer(strlen(error), error,
                                                          MHD_RESPMEM_MUST_FREE);
                AddCorsHeaders(response);
                ret = MHD_queue_response(connection, MHD_HTTP_REQUEST_ENTITY_TOO_LARGE, response);
                MHD_destroy_response(response);
                return ret;
            }
            
            char *new_data = realloc(con_info->data, con_info->size + *upload_data_size + 1);
            if (!new_data) return MHD_NO;
            
            con_info->data = new_data;
            memcpy(con_info->data + con_info->size, upload_data, *upload_data_size);
            con_info->size += *upload_data_size;
            con_info->data[con_info->size] = '\0';
            
            *upload_data_size = 0;
            return MHD_YES;
        }
        
        if (con_info->data) {
            char config_path[256];
            char algorithm[50];
            int quantum, cpu_limit, nb_priority;
            
            if (CreateConfigFileFromJson(
                    con_info->data,
                    config_path, sizeof(config_path),
                    algorithm, sizeof(algorithm),
                    &quantum, &cpu_limit, &nb_priority) == 0) {
                
                char *json_response = RunSchedulerAndCaptureOutput(
                    config_path, algorithm, quantum, cpu_limit, nb_priority
                );
                
                if (json_response) {
                    response = MHD_create_response_from_buffer(
                        strlen(json_response),
                        json_response,
                        MHD_RESPMEM_MUST_FREE
                    );
                    status_code = MHD_HTTP_OK;
                } else {
                    char *error = CreateErrorResponse("Failed to execute scheduler");
                    response = MHD_create_response_from_buffer(
                        strlen(error), error, MHD_RESPMEM_MUST_FREE
                    );
                    status_code = MHD_HTTP_INTERNAL_SERVER_ERROR;
                }
            } else {
                char *error = CreateErrorResponse("Invalid request format");
                response = MHD_create_response_from_buffer(
                    strlen(error), error, MHD_RESPMEM_MUST_FREE
                );
                status_code = MHD_HTTP_BAD_REQUEST;
            }
            
            AddCorsHeaders(response);
            ret = MHD_queue_response(connection, status_code, response);
            MHD_destroy_response(response);
            return ret;
        }
    }
    
    if (strcmp(method, "GET") == 0 && strcmp(url, "/api/algorithms") == 0) {
        char *algorithms_json = GetAlgorithmsJson();
        
        response = MHD_create_response_from_buffer(
            strlen(algorithms_json),
            algorithms_json,
            MHD_RESPMEM_MUST_FREE
        );
        AddCorsHeaders(response);
        ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        return ret;
    }
    
    
    char *not_found = CreateErrorResponse("Endpoint not found");
    response = MHD_create_response_from_buffer(
        strlen(not_found), not_found, MHD_RESPMEM_MUST_FREE
    );
    AddCorsHeaders(response);
    ret = MHD_queue_response(connection, MHD_HTTP_NOT_FOUND, response);
    MHD_destroy_response(response);
    return ret;
}

void RequestCompleted(
    void *cls,
    struct MHD_Connection *connection,
    void **con_cls,
    enum MHD_RequestTerminationCode toe
) {
    struct ConnectionInfo *con_info = *con_cls;
    
    if (con_info) {
        if (con_info->data) {
            free(con_info->data);
        }
        free(con_info);
        *con_cls = NULL;
    }
}