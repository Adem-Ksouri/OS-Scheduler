CC = gcc
CFLAGS = -Wall -Wextra -g -I .. -I .

OUT_DIR = Executables
OBJ_DIR = build

# All unit test source files (with relative path)
TEST_SRCS := $(shell find . -name '*UnitTest.c')

# Flattened executable names
TEST_NAMES := $(notdir $(TEST_SRCS:.c=))
TEST_BINS := $(addprefix $(OUT_DIR)/, $(TEST_NAMES))

# Helpers
HELPER_SRCS := $(shell find . -name 'Helpers.c')
HELPER_OBJS := $(patsubst ./%, $(OBJ_DIR)/%, $(HELPER_SRCS:.c=.o))

# Map each test executable to its source and object
define MAKE_TEST_RULES
$$(OUT_DIR)/$(notdir $(1:.c=)): $(OBJ_DIR)/$(1:.c=.o) $(HELPER_OBJS) ../Src/libcore.a
	$$(CC) $$(CFLAGS) -o $$@ $$^
$$(OBJ_DIR)/$(1:.c=.o): $(1) | $(OBJ_DIR)
	@mkdir -p $$(dir $$@)
	$$(CC) $$(CFLAGS) -c $$< -o $$@
endef

# Generate rules for all tests
$(foreach src,$(TEST_SRCS),$(eval $(call MAKE_TEST_RULES,$(src))))

# Default target
all: ../Src/libcore.a $(HELPER_OBJS) $(OUT_DIR) $(TEST_BINS)

# Build src library first
../Src/libcore.a:
	$(MAKE) -C ../Src

# Ensure folders exist
$(OUT_DIR):
	mkdir -p $(OUT_DIR)

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

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
	rm -rf $(OBJ_DIR) $(TEST_BINS)

.PHONY: all clean run