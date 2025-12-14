CC = gcc
CFLAGS = -Wall -Wextra -g -I.. -I../Include
LIBS_SERVER = -lmicrohttpd -ljson-c -lpthread

SRCDIR := .
OBJDIR := build
MAINDIR := Main
SERVERDIR := Server


MAKEFILE_DIR := $(shell pwd)

COMMON_SRCS := $(shell find $(SRCDIR) -name '*.c' ! -path '*/Main/*' ! -path '*/Server/*')
COMMON_OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(COMMON_SRCS))


SERVER_SRCS := $(SERVERDIR)/ResponseUtils.c \
               $(SERVERDIR)/SchedulerExecutor.c \
               $(SERVERDIR)/RequestHandler.c \
               $(SERVERDIR)/HttpServer.c
SERVER_OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(SERVER_SRCS))


ORIGINAL_TARGET := main
CLI_TARGET := scheduler_cli
SERVER_TARGET := scheduler_server


all: build


build: $(ORIGINAL_TARGET) $(CLI_TARGET) $(SERVER_TARGET)
	@echo ""
	@echo "✓ Build complete!"
	@echo "  - $(ORIGINAL_TARGET)  : Original interactive version"
	@echo "  - $(CLI_TARGET)       : CLI version (used by server)"
	@echo "  - $(SERVER_TARGET)    : HTTP API server"
	@echo ""
	@echo "Current directory: $(MAKEFILE_DIR)"
	@echo ""
	@echo "Usage:"
	@echo "  make run           - Start the HTTP server (default)"
	@echo "  make run-original  - Run original interactive version"


run: $(SERVER_TARGET) $(CLI_TARGET)
	@echo "Starting HTTP API Server on port 8080..."
	@echo "Working directory: $(MAKEFILE_DIR)"
	@if [ ! -f "$(CLI_TARGET)" ]; then \
		echo "ERROR: $(CLI_TARGET) not found!"; \
		echo "Please run 'make' first to build the executables."; \
		exit 1; \
	fi
	@if [ ! -x "$(CLI_TARGET)" ]; then \
		echo "ERROR: $(CLI_TARGET) is not executable!"; \
		chmod +x $(CLI_TARGET); \
		echo "Fixed: Made $(CLI_TARGET) executable"; \
	fi
	@echo "✓ $(CLI_TARGET) is ready"
	@echo ""
	@echo "Press Ctrl+C to stop"
	@echo ""
	@cd $(MAKEFILE_DIR) && ./$(SERVER_TARGET) --server


$(OBJDIR)/%.o: %.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

$(ORIGINAL_TARGET): $(COMMON_OBJS) $(MAINDIR)/main.c
	@echo "Building $(ORIGINAL_TARGET)..."
	$(CC) $(CFLAGS) $(MAINDIR)/main.c $(COMMON_OBJS) -o $@
	@chmod +x $@


$(CLI_TARGET): $(COMMON_OBJS) $(MAINDIR)/main_cli.c
	@echo "Building $(CLI_TARGET)..."
	$(CC) $(CFLAGS) $(MAINDIR)/main_cli.c $(COMMON_OBJS) -o $@
	@chmod +x $@


$(SERVER_TARGET): $(COMMON_OBJS) $(SERVER_OBJS) $(MAINDIR)/main_server.c
	@echo "Building $(SERVER_TARGET)..."
	$(CC) $(CFLAGS) $(MAINDIR)/main_server.c $(COMMON_OBJS) $(SERVER_OBJS) $(LIBS_SERVER) -o $@
	@chmod +x $@


clean:
	@echo "Cleaning build artifacts..."
	rm -rf $(OBJDIR)
	rm -f $(ORIGINAL_TARGET) $(CLI_TARGET) $(SERVER_TARGET)
	rm -f /tmp/scheduler_config_*.txt /tmp/scheduler_output_*.json
	@echo "✓ Clean complete"


run-original: $(ORIGINAL_TARGET)
	@echo "Running original interactive version..."
	@echo ""
	@cd $(MAKEFILE_DIR) && ./$(ORIGINAL_TARGET) ../UnitTests/TestFiles/config.txt

run-server: run
test:
	@echo "Running unit tests..."
	$(MAKE) -C ../UnitTests run

.PHONY: test

help:
	@echo "OS Scheduler Simulator - Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  make              - Build all executables"
	@echo "  make run          - Start HTTP server (default) on port 8080"
	@echo "  make run-original - Run original interactive version"
	@echo "  make run-cli      - Test CLI version manually"
	@echo "  make clean        - Remove all build artifacts"
	@echo "  make help         - Show this help message"
	@echo "  make test         - Run unit tests"
	@echo ""


.PHONY: all build run run-server run-original run-cli test clean help check install