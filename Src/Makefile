CC = gcc
CFLAGS = -Wall -Wextra -g -I .

# Find all .c files
SRCS := $(shell find . -name '*.c')

# Put all .o files inside build/
OBJDIR := build
OBJS := $(patsubst %.c,$(OBJDIR)/%.o,$(SRCS))

TARGET = libcore.a

all: $(TARGET)

# Archive target
$(TARGET): $(OBJS)
	ar rcs $@ $^

# Rule for building object files inside build/
# Uses mkdir -p to ensure the directory exists
$(OBJDIR)/%.o: %.c
	mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(OBJDIR) $(TARGET)

.PHONY: all clean
