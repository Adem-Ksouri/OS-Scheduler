# Src/Makefile — master Makefile for the whole project

CC = gcc
CFLAGS  = -Wall -Wextra -g -I.
LDFLAGS = -lpthread

# Use pkg-config for libmicrohttpd whenever possible (best practice)
ifeq ($(shell pkg-config --exists libmicrohttpd && echo yes),yes)
    CFLAGS  += $(shell pkg-config --cflags libmicrohttpd)
    LDFLAGS += $(shell pkg-config --libs   libmicrohttpd)
else
    LDFLAGS += -lmicrohttpd
endif

# Uncomment these two lines only if you use HTTPS/TLS in your server
# LDFLAGS += -lssl -lcrypto
# CFLAGS  += -DHAVE_TLS

# Paths
MAIN_SRC     = Main/main.c
MAIN_OBJ     = Main/main.o
MAIN_EXE     = Main/main
LIBCORE      = libcore.a

# Default target
all: $(LIBCORE) $(MAIN_EXE)

# Build the static library (all .c files in Src/ except Main/)
SRCS := $(filter-out $(MAIN_SRC), $(shell find . -name '*.c'))
OBJS := $(patsubst ./%.c, %.o, $(SRCS))

$(LIBCORE): $(OBJS)
	$(AR) rcs $@ $^

%.o: ./%.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

# Build the final executable
$(MAIN_EXE): $(MAIN_OBJ) $(LIBCORE)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(MAIN_OBJ): $(MAIN_SRC)
	$(CC) $(CFLAGS) -c $< -o $@

# Convenience targets
run: all
	@echo "Starting OS-Scheduler server on http://localhost:8080 ..."
	./$(MAIN_EXE)

clean:
	rm -f $(LIBCORE)
	rm -f $(MAIN_OBJ) $(MAIN_EXE)
	find . -name '*.o' -delete

# Optional: rebuild everything from scratch
rebuild: clean all

.PHONY: all run clean rebuild