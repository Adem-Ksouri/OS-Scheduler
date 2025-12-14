CC = gcc
CFLAGS = -Wall -Wextra -g -I.. -I../Include
LIBS_SERVER = -lmicrohttpd -ljson-c -lpthread

SRCDIR := .
OBJDIR := build
MAINDIR := Main
SERVERDIR := Server

# Common source files (excluding Main and Server directories)
COMMON_SRCS := $(shell find $(SRCDIR) -name '*.c' ! -path '*/Main/*' ! -path '*/Server/*')
COMMON_OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(COMMON_SRCS))

# Server source files (AlgorithmCache.c removed)
SERVER_SRCS := $(SERVERDIR)/ResponseUtils.c \
               $(SERVERDIR)/SchedulerExecutor.c \
               $(SERVERDIR)/RequestHandler.c \
               $(SERVERDIR)/HttpServer.c
SERVER_OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(SERVER_SRCS))

# Target executables
ORIGINAL_TARGET := main
CLI_TARGET := scheduler_cli
SERVER_TARGET := scheduler_server

# Default target: build all and run server
all: build

# Build all executables
build: $(ORIGINAL_TARGET) $(CLI_TARGET) $(SERVER_TARGET)
	@echo ""
	@echo "✓ Build complete!"
	@echo "  - $(ORIGINAL_TARGET)  : Original interactive version"
	@echo "  - $(CLI_TARGET)       : CLI version (used by server)"
	@echo "  - $(SERVER_TARGET)    : HTTP API server"
	@echo ""
	@echo "Usage:"
	@echo "  make run           - Start the HTTP server (default)"
	@echo "  make run-original  - Run original interactive version"
	@echo "  make run-cli       - Test CLI version manually"

# Default run target: start the server
run: $(SERVER_TARGET)
	@echo "Starting HTTP API Server on port 8080..."
	@echo "Press Ctrl+C to stop"
	@echo ""
	./$(SERVER_TARGET) --server

# Build object files
$(OBJDIR)/%.o: %.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

# Build original interactive main
$(ORIGINAL_TARGET): $(COMMON_OBJS) $(MAINDIR)/main.c
	@echo "Building $(ORIGINAL_TARGET)..."
	$(CC) $(CFLAGS) $(MAINDIR)/main.c $(COMMON_OBJS) -o $@

# Build CLI version (used by server)
$(CLI_TARGET): $(COMMON_OBJS) $(MAINDIR)/main_cli.c
	@echo "Building $(CLI_TARGET)..."
	$(CC) $(CFLAGS) $(MAINDIR)/main_cli.c $(COMMON_OBJS) -o $@

# Build server
$(SERVER_TARGET): $(COMMON_OBJS) $(SERVER_OBJS) $(MAINDIR)/main_server.c
	@echo "Building $(SERVER_TARGET)..."
	$(CC) $(CFLAGS) $(MAINDIR)/main_server.c $(COMMON_OBJS) $(SERVER_OBJS) $(LIBS_SERVER) -o $@

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf $(OBJDIR)
	rm -f $(ORIGINAL_TARGET) $(CLI_TARGET) $(SERVER_TARGET)
	rm -f /tmp/scheduler_config_*.txt /tmp/scheduler_output_*.json
	@echo "✓ Clean complete"

# Run original interactive version
run-original: $(ORIGINAL_TARGET)
	@echo "Running original interactive version..."
	@echo ""
	./$(ORIGINAL_TARGET) ../config.txt

# Run server (alias for 'run')
run-server: run

# Test CLI version manually
run-cli: $(CLI_TARGET)
	@echo "Testing CLI version with Fifo algorithm..."
	@echo ""
	./$(CLI_TARGET) ../config.txt Fifo

# Quick test of both algorithms
test: $(CLI_TARGET)
	@echo "Testing Fifo algorithm..."
	./$(CLI_TARGET) ../config.txt Fifo | head -n 20
	@echo ""
	@echo "Testing RoundRobin algorithm..."
	./$(CLI_TARGET) ../config.txt RoundRobin 2 | head -n 20

# Show help
help:
	@echo "OS Scheduler Simulator - Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  make              - Build all executables"
	@echo "  make run          - Start HTTP server (default) on port 8080"
	@echo "  make run-original - Run original interactive version"
	@echo "  make run-cli      - Test CLI version manually"
	@echo "  make test         - Run tests with Fifo and RoundRobin"
	@echo "  make clean        - Remove all build artifacts"
	@echo "  make help         - Show this help message"
	@echo ""
	@echo "Examples:"
	@echo "  make              # Build everything"
	@echo "  make run          # Start server"
	@echo "  make run-original # Run interactive version"
	@echo ""

# Check if executables are built
check:
	@echo "Checking executables..."
	@test -f $(ORIGINAL_TARGET) && echo "✓ $(ORIGINAL_TARGET) exists" || echo "✗ $(ORIGINAL_TARGET) missing"
	@test -f $(CLI_TARGET) && echo "✓ $(CLI_TARGET) exists" || echo "✗ $(CLI_TARGET) missing"
	@test -f $(SERVER_TARGET) && echo "✓ $(SERVER_TARGET) exists" || echo "✗ $(SERVER_TARGET) missing"
	@echo ""
	@test -x $(ORIGINAL_TARGET) && echo "✓ $(ORIGINAL_TARGET) is executable" || echo "✗ $(ORIGINAL_TARGET) not executable"
	@test -x $(CLI_TARGET) && echo "✓ $(CLI_TARGET) is executable" || echo "✗ $(CLI_TARGET) not executable"
	@test -x $(SERVER_TARGET) && echo "✓ $(SERVER_TARGET) is executable" || echo "✗ $(SERVER_TARGET) not executable"

.PHONY: all build run run-server run-original run-cli test clean help check