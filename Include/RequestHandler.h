#ifndef REQUEST_HANDLER_H
#define REQUEST_HANDLER_H

#include <microhttpd.h>

struct ConnectionInfo {
    char *data;
    size_t size;
};


enum MHD_Result HandleRequest(
    void *cls,
    struct MHD_Connection *connection,
    const char *url,
    const char *method,
    const char *version,
    const char *upload_data,
    size_t *upload_data_size,
    void **con_cls
);

void RequestCompleted(
    void *cls,
    struct MHD_Connection *connection,
    void **con_cls,
    enum MHD_RequestTerminationCode toe
);

#endif 
