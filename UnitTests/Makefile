CC = gcc
CFLAGS = -Wall -Wextra -g -I../Src -I../Src/Schedulers -I../Src/Main -I../Src/Parser -I../Src/Queue -I../Src/LinkedList -I../Src/Utils -I.

OUT_DIR = Executables
OBJ_DIR = build

# Source files from Src directory
SRC_DIR = ../Src
SRC_FILES := $(shell find $(SRC_DIR) -name '*.c' ! -name 'main.c')
SRC_OBJS := $(patsubst $(SRC_DIR)/%.c,$(OBJ_DIR)/src/%.o,$(SRC_FILES))

# All unit test source files
TEST_SRCS := $(shell find . -name '*UnitTest.c')

# Flattened executable names
TEST_NAMES := $(notdir $(TEST_SRCS:.c=))
TEST_BINS := $(addprefix $(OUT_DIR)/, $(TEST_NAMES))

# Helpers
HELPER_SRCS := $(shell find . -name 'Helpers.c')
HELPER_OBJS := $(patsubst ./%, $(OBJ_DIR)/%, $(HELPER_SRCS:.c=.o))

# Map each test executable to its source and object
define MAKE_TEST_RULES
$$(OUT_DIR)/$(notdir $(1:.c=)): $(OBJ_DIR)/$(1:.c=.o) $(HELPER_OBJS) $(SRC_OBJS)
	@mkdir -p $$(dir $$@)
	$$(CC) $$(CFLAGS) -o $$@ $$^

$$(OBJ_DIR)/$(1:.c=.o): $(1) | $(OBJ_DIR)
	@mkdir -p $$(dir $$@)
	$$(CC) $$(CFLAGS) -c $$< -o $$@
endef

# Generate rules for all tests
$(foreach src,$(TEST_SRCS),$(eval $(call MAKE_TEST_RULES,$(src))))

# Default target
all: $(SRC_OBJS) $(HELPER_OBJS) $(OUT_DIR) $(TEST_BINS)

# Ensure folders exist
$(OUT_DIR):
	mkdir -p $(OUT_DIR)

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

# Compile source files from ../Src
$(OBJ_DIR)/src/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

# Compile helpers
$(OBJ_DIR)/%.o: ./%.c | $(OBJ_DIR)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

# Run all tests
run: all
	@echo "Running all unit tests..."
	@for exe in $(TEST_BINS); do \
		echo "=== Running $$exe ==="; \
		$$exe || exit 1; \
	done
	@echo "All tests completed successfully."

# Clean
clean:
	rm -rf $(OBJ_DIR) $(OUT_DIR)

# Debug: Print variables
debug:
	@echo "SRC_FILES: $(SRC_FILES)"
	@echo "SRC_OBJS: $(SRC_OBJS)"
	@echo "TEST_SRCS: $(TEST_SRCS)"
	@echo "TEST_BINS: $(TEST_BINS)"
	@echo "HELPER_SRCS: $(HELPER_SRCS)"
	@echo "HELPER_OBJS: $(HELPER_OBJS)"

.PHONY: all clean run debug