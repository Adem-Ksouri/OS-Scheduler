#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <json-c/json.h>
#include "../../Include/ResponseUtils.h"
#include "../../Include/AlgorithmCache.h"

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

char* GetAlgorithmsJson(void) {
    char cwd[256];
    if (getcwd(cwd, sizeof(cwd)) == NULL) {
        return CreateErrorResponse("Failed to get current directory");
    }
    
    char schedulers_path[512];
    snprintf(schedulers_path, sizeof(schedulers_path), "%s/Schedulers", cwd);
    
    int count = 0;
    AlgorithmInfo *algorithms = GetCachedAlgorithms(schedulers_path, &count);
    
    if (!algorithms || count == 0) {
        return strdup("{\"algorithms\":[],\"error\":\"No algorithms found\"}");
    }
    
    json_object *root = json_object_new_object();
    json_object *array = json_object_new_array();
    
    for (int i = 0; i < count; i++) {
    json_object *algo = json_object_new_object();

    json_object_object_add(algo, "id", json_object_new_int(i + 1));
    json_object_object_add(algo, "name", json_object_new_string(algorithms[i].name));

    // params is now an OBJECT, not an array
    json_object *params = json_object_new_object();

    if (algorithms[i].has_quantum) {
        json_object_object_add(
            params,
            "quantum",
            json_object_new_boolean(1)
        );
    }

    if (algorithms[i].has_priority) {
        json_object_object_add(
            params,
            "nb_priority",
            json_object_new_boolean(1)
        );
    }

    if (algorithms[i].has_cpu_limit) {
        json_object_object_add(
            params,
            "cpu_usage_limit",
            json_object_new_boolean(1)
        );
    }

    json_object_object_add(algo, "params", params);
    json_object_array_add(array, algo);
}

    
    json_object_object_add(root, "algorithms", array);
    json_object_object_add(root, "total", json_object_new_int(count));
    
    const char *json_str = json_object_to_json_string(root);
    char *result = strdup(json_str);
    
    json_object_put(root);
    free(algorithms);
    
    return result;
}