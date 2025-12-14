# ===============================
# Compiler & tools
# ===============================
CC = gcc

PKG_CFLAGS := $(shell pkg-config --cflags libmicrohttpd json-c)
PKG_LIBS   := $(shell pkg-config --libs libmicrohttpd json-c)

CFLAGS = -Wall -Wextra -g -I.. -I../Include $(PKG_CFLAGS)
LDFLAGS =
LIBS_SERVER = $(PKG_LIBS) -lpthread


# ===============================
# Directories
# ===============================
SRCDIR := .
OBJDIR := build
MAINDIR := Main
SERVERDIR := Server

MAKEFILE_DIR := $(shell pwd)


# ===============================
# Source files
# ===============================
COMMON_SRCS := $(shell find $(SRCDIR) -name '*.c' \
	! -path '*/Main/*' \
	! -path '*/Server/*')

COMMON_OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(COMMON_SRCS))


SERVER_SRCS := \
	$(SERVERDIR)/ResponseUtils.c \
	$(SERVERDIR)/SchedulerExecutor.c \
	$(SERVERDIR)/RequestHandler.c \
	$(SERVERDIR)/HttpServer.c

SERVER_OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(SERVER_SRCS))


# ===============================
# Targets
# ===============================
ORIGINAL_TARGET := main
CLI_TARGET := scheduler_cli
SERVER_TARGET := scheduler_server


# ===============================
# Default target
# ===============================
all: build


build: $(ORIGINAL_TARGET) $(CLI_TARGET) $(SERVER_TARGET)
	@echo ""
	@echo "✓ Build complete!"
	@echo "  - $(ORIGINAL_TARGET)  : Original interactive version"
	@echo "  - $(CLI_TARGET)       : CLI version (used by server)"
	@echo "  - $(SERVER_TARGET)    : HTTP API server"
	@echo ""


# ===============================
# Run server
# ===============================
run: $(SERVER_TARGET) $(CLI_TARGET)
	@echo "Starting HTTP API Server on port 8080..."
	@echo "Working directory: $(MAKEFILE_DIR)"
	@if [ ! -f "$(CLI_TARGET)" ]; then \
		echo "ERROR: $(CLI_TARGET) not found!"; \
		exit 1; \
	fi
	@if [ ! -x "$(CLI_TARGET)" ]; then \
		chmod +x $(CLI_TARGET); \
	fi
	@echo ""
	@echo "Press Ctrl+C to stop"
	@echo ""
	@cd $(MAKEFILE_DIR) && ./$(SERVER_TARGET) --server


# ===============================
# Object build rule
# ===============================
$(OBJDIR)/%.o: %.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@


# ===============================
# Executables
# ===============================
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
	$(CC) $(CFLAGS) \
		$(MAINDIR)/main_server.c \
		$(COMMON_OBJS) \
		$(SERVER_OBJS) \
		$(LIBS_SERVER) \
		-o $@
	@chmod +x $@


# ===============================
# Utilities
# ===============================
clean:
	@echo "Cleaning build artifacts..."
	rm -rf $(OBJDIR)
	rm -f $(ORIGINAL_TARGET) $(CLI_TARGET) $(SERVER_TARGET)
	rm -f /tmp/scheduler_config_*.txt /tmp/scheduler_output_*.json
	@echo "✓ Clean complete"


run-original: $(ORIGINAL_TARGET)
	@echo "Running original interactive version..."
	@cd $(MAKEFILE_DIR) && ./$(ORIGINAL_TARGET) ../UnitTests/TestFiles/config.txt


test:
	@echo "Running unit tests..."
	$(MAKE) -C ../UnitTests run


help:
	@echo "OS Scheduler Simulator - Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  make              - Build all executables"
	@echo "  make run          - Start HTTP server on port 8080"
	@echo "  make run-original - Run original interactive version"
	@echo "  make clean        - Remove all build artifacts"
	@echo "  make test         - Run unit tests"
	@echo ""


.PHONY: all build run clean run-original test help
