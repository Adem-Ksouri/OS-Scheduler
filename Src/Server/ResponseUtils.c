#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <dirent.h>
#include <json-c/json.h>
#include "../../Include/ResponseUtils.h"

void AddCorsHeaders(struct MHD_Response *response) {
    MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
    MHD_add_response_header(response, "Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    MHD_add_response_header(response, "Access-Control-Allow-Headers", "Content-Type");
    MHD_add_response_header(response, "Content-Type", "application/json");
}

char* CreateErrorResponse(const char *error_message) {
    size_t len = strlen(error_message) + 64;
    char *response = malloc(len);
    if (!response) return NULL;
    
    snprintf(response, len, 
             "{\"success\":false,\"error\":\"%s\"}", 
             error_message);
    
    return response;
}

// Detect algorithms directly without cache
static int DetectAvailableAlgorithms(const char *schedulers_path, json_object *array) {
    DIR *dir = opendir(schedulers_path);
    if (!dir) {
        fprintf(stderr, "Warning: Cannot open schedulers directory: %s\n", schedulers_path);
        return 0;
    }
    
    struct dirent *entry;
    int found = 0;
    int id = 1;
    
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }
        
        size_t len = strlen(entry->d_name);
        if (len > 2 && strcmp(entry->d_name + len - 2, ".c") == 0) {
            char name[50];
            strncpy(name, entry->d_name, len - 2);
            name[len - 2] = '\0';
            
            // Skip main and test files
            if (strcmp(name, "main") == 0 || strcmp(name, "test") == 0) {
                continue;
            }
            
            json_object *algo = json_object_new_object();
            json_object_object_add(algo, "id", json_object_new_int(id++));
            json_object_object_add(algo, "name", json_object_new_string(name));
            
            // Create params object
            json_object *params = json_object_new_object();
            
            // Determine parameters based on algorithm name
            if (strcasecmp(name, "RoundRobin") == 0 || strcasecmp(name, "rr") == 0) {
                json_object_object_add(params, "quantum", json_object_new_boolean(1));
            }
            
            if (strcasecmp(name, "Multilevel") == 0 || strcasecmp(name, "mlq") == 0) {
                json_object_object_add(params, "nb_priority", json_object_new_boolean(1));
                json_object_object_add(params, "cpu_usage_limit", json_object_new_boolean(1));
            }
            
            json_object_object_add(algo, "params", params);
            json_object_array_add(array, algo);
            found++;
        }
    }
    
    closedir(dir);
    return found;
}

char* GetAlgorithmsJson(void) {
    char cwd[256];
    if (getcwd(cwd, sizeof(cwd)) == NULL) {
        return CreateErrorResponse("Failed to get current directory");
    }
    
    char schedulers_path[512];
    snprintf(schedulers_path, sizeof(schedulers_path), "%s/Schedulers", cwd);
    
    json_object *root = json_object_new_object();
    json_object *array = json_object_new_array();
    
    int count = DetectAvailableAlgorithms(schedulers_path, array);
    
    if (count == 0) {
        // Add default algorithms if directory scan failed
        json_object *fifo = json_object_new_object();
        json_object_object_add(fifo, "id", json_object_new_int(1));
        json_object_object_add(fifo, "name", json_object_new_string("Fifo"));
        json_object_object_add(fifo, "params", json_object_new_object());
        json_object_array_add(array, fifo);
        
        json_object *rr = json_object_new_object();
        json_object_object_add(rr, "id", json_object_new_int(2));
        json_object_object_add(rr, "name", json_object_new_string("RoundRobin"));
        json_object *rr_params = json_object_new_object();
        json_object_object_add(rr_params, "quantum", json_object_new_boolean(1));
        json_object_object_add(rr, "params", rr_params);
        json_object_array_add(array, rr);
        
        json_object *pp = json_object_new_object();
        json_object_object_add(pp, "id", json_object_new_int(3));
        json_object_object_add(pp, "name", json_object_new_string("PreemptivePriority"));
        json_object_object_add(pp, "params", json_object_new_object());
        json_object_array_add(array, pp);
        
        json_object *ml = json_object_new_object();
        json_object_object_add(ml, "id", json_object_new_int(4));
        json_object_object_add(ml, "name", json_object_new_string("Multilevel"));
        json_object *ml_params = json_object_new_object();
        json_object_object_add(ml_params, "nb_priority", json_object_new_boolean(1));
        json_object_object_add(ml_params, "cpu_usage_limit", json_object_new_boolean(1));
        json_object_object_add(ml, "params", ml_params);
        json_object_array_add(array, ml);
        
        count = 4;
    }
    
    json_object_object_add(root, "algorithms", array);
    json_object_object_add(root, "total", json_object_new_int(count));
    
    const char *json_str = json_object_to_json_string(root);
    char *result = strdup(json_str);
    
    json_object_put(root);
    
    return result;
}