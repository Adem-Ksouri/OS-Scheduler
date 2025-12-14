CC = gcc
CFLAGS = -Wall -Wextra -g -I../Src -I../Src/Schedulers -I../Src/Main -I../Src/Parser -I../Src/Queue -I../Src/LinkedList -I../Src/Utils -I.

OUT_DIR = Executables
OBJ_DIR = build

MAIN_DIR = ../Src

TEST_SRCS := $(shell find . -name '*UnitTest.c')

TEST_NAMES := $(notdir $(TEST_SRCS:.c=))
TEST_BINS := $(addprefix $(OUT_DIR)/, $(TEST_NAMES))

HELPER_SRCS := $(shell find . -name 'Helpers.c')
HELPER_OBJS := $(patsubst ./%, $(OBJ_DIR)/%, $(HELPER_SRCS:.c=.o))

define MAKE_TEST_RULES
$$(OUT_DIR)/$(notdir $(1:.c=)): $(OBJ_DIR)/$(1:.c=.o) $(HELPER_OBJS)
	@mkdir -p $$(dir $$@)
	@$(MAKE) -C $(MAIN_DIR) $(CLI_TARGET) 2>/dev/null || true
	$$(CC) $$(CFLAGS) -o $$@ $$^ $$(shell find $(MAIN_DIR)/build -name '*.o' 2>/dev/null | grep -v '/Main/' | grep -v '/Server/')

$$(OBJ_DIR)/$(1:.c=.o): $(1) | $(OBJ_DIR)
	@mkdir -p $$(dir $$@)
	$$(CC) $$(CFLAGS) -c $$< -o $$@
endef

$(foreach src,$(TEST_SRCS),$(eval $(call MAKE_TEST_RULES,$(src))))


all: $(HELPER_OBJS) $(OUT_DIR) $(TEST_BINS)


$(OUT_DIR):
	mkdir -p $(OUT_DIR)

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)


$(OBJ_DIR)/%.o: ./%.c | $(OBJ_DIR)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

run: all
	@echo "Running all unit tests..."
	@for exe in $(TEST_BINS); do \
		echo "=== Running $$exe ==="; \
		$$exe || exit 1; \
	done
	@echo "All tests completed successfully."


clean:
	rm -rf $(OBJ_DIR) $(OUT_DIR)

.PHONY: all clean run