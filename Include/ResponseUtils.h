#ifndef RESPONSE_UTILS_H
#define RESPONSE_UTILS_H

#include <microhttpd.h>

void AddCorsHeaders(struct MHD_Response *response);
char* CreateErrorResponse(const char *error_message);
char* GetAlgorithmsJson(void);

#endif 