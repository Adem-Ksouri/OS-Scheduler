CC = gcc
CFLAGS = -Wall -Wextra -g -I .

# Find all .c files
SRCS := $(shell find . -name '*.c')
OBJS := $(SRCS:.c=.o)

TARGET = libcore.a

all: $(TARGET)

$(TARGET): $(OBJS)
	ar rcs $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: all clean
