// Include/ResponseUtils.h
#ifndef RESPONSE_UTILS_H
#define RESPONSE_UTILS_H

#include <microhttpd.h>

/**
 * Add CORS headers to response
 * 
 * @param response MHD response object
 */
void AddCorsHeaders(struct MHD_Response *response);

/**
 * Create a JSON error response
 * 
 * @param error_message Error message to include
 * @return JSON string (must be freed by caller)
 */
char* CreateErrorResponse(const char *error_message);

/**
 * Get algorithms as JSON string
 * 
 * @return JSON string with available algorithms (must be freed by caller)
 */
char* GetAlgorithmsJson(void);

#endif // RESPONSE_UTILS_H