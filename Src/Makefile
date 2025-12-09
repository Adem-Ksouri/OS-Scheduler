# Compiler and flags
CC = gcc
CFLAGS = -Wall -Wextra -g -I.

# Config file path (command-line argument)
CONF := $(shell pwd)/../UnitTests/TestFiles/config.txt
SCHEDULERS_FOLDER := $(shell pwd)/../Src/Schedulers/

# Source files
SRCDIR := .
SRCS := $(shell find $(SRCDIR) -name '*.c' ! -name 'main.c')

# Object files (inside build folder)
OBJDIR := build
OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(SRCS))

# Target executable
TARGET := main

# Default target
all: $(TARGET)

# Rule to build object files
$(OBJDIR)/%.o: %.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

# Link object files and main.c into executable
$(TARGET): $(OBJS) Main/main.c
	$(CC) $(CFLAGS) Main/main.c $(OBJS) -o $@

# Run the program with the config file
run: $(TARGET)
	@echo "Running $(TARGET) with $(CONF):"
	./$(TARGET) $(CONF) $(SCHEDULERS_FOLDER)

# Clean build files
clean:
	rm -rf $(OBJDIR) $(TARGET)

.PHONY: all run clean
