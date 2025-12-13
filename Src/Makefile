CC = gcc
CFLAGS = -Wall -Wextra -g -I.. -I../Include
LIBS_SERVER = -lmicrohttpd -ljson-c -lpthread

SRCDIR := .
OBJDIR := build
MAINDIR := Main
SERVERDIR := Server

COMMON_SRCS := $(shell find $(SRCDIR) -name '*.c' ! -path '*/Main/*' ! -path '*/Server/*')
COMMON_OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(COMMON_SRCS))

SERVER_SRCS := $(SERVERDIR)/AlgorithmCache.c $(SERVERDIR)/ResponseUtils.c \
               $(SERVERDIR)/SchedulerExecutor.c $(SERVERDIR)/RequestHandler.c \
               $(SERVERDIR)/HttpServer.c
SERVER_OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(SERVER_SRCS))

ORIGINAL_TARGET := main
CLI_TARGET := scheduler_cli
SERVER_TARGET := scheduler_server

all: $(ORIGINAL_TARGET) $(CLI_TARGET) $(SERVER_TARGET)

$(OBJDIR)/%.o: %.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

$(ORIGINAL_TARGET): $(COMMON_OBJS) $(MAINDIR)/main.c
	$(CC) $(CFLAGS) $(MAINDIR)/main.c $(COMMON_OBJS) -o $@

$(CLI_TARGET): $(COMMON_OBJS) $(MAINDIR)/main_cli.c
	$(CC) $(CFLAGS) $(MAINDIR)/main_cli.c $(COMMON_OBJS) -o $@

$(SERVER_TARGET): $(COMMON_OBJS) $(SERVER_OBJS) $(MAINDIR)/main_server.c
	$(CC) $(CFLAGS) $(MAINDIR)/main_server.c $(COMMON_OBJS) $(SERVER_OBJS) $(LIBS_SERVER) -o $@

clean:
	rm -rf $(OBJDIR)
	rm -f $(ORIGINAL_TARGET) $(CLI_TARGET) $(SERVER_TARGET)
	rm -f /tmp/scheduler_config_*.txt /tmp/scheduler_output_*.json

run-original: $(ORIGINAL_TARGET)
	./$(ORIGINAL_TARGET) ../config.txt

run-server: $(SERVER_TARGET)
	./$(SERVER_TARGET) --server

run-cli: $(CLI_TARGET)
	./$(CLI_TARGET) ../config.txt Fifo

test: $(ORIGINAL_TARGET) $(CLI_TARGET)
	./$(CLI_TARGET) ../config.txt Fifo | head -n 15
	./$(CLI_TARGET) ../config.txt RoundRobin 2 | head -n 15

.PHONY: all clean run-original run-server run-cli test