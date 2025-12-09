# Simple Makefile for UnitTests

CC = gcc
CFLAGS = -Wall -Wextra -g -I .. -I .

# Absolute path to TestFiles directory
TEST_FILES_PATH := $(shell pwd)/

# All .c files in the current directory (unit test + helper)
FifoUnitTest := FifoUnitTests/FifoUnitTest.c TestHelpers/Helpers.c
AddHeadUnitTest := ListUnitTests/AddHeadUnitTest.c TestHelpers/Helpers.c
CreateListUnitTest := ListUnitTests/CreateListUnitTest.c TestHelpers/Helpers.c
MultilevelUnitTest := MultilevelUnitTests/MultilevelUnitTest.c TestHelpers/Helpers.c
ParserUnitTest := ParserUnitTests/ParserUnitTest.c TestHelpers/Helpers.c
PreemptivePriorityUnitTest := PreemptivePriorityUnitTests/PreemptivePriorityUnitTest.c TestHelpers/Helpers.c
QueueUnitTest := QueueTests/QueueUnitTest.c TestHelpers/Helpers.c
RoundRobinUnitTest := RoundRobinUnitTests/RoundRobinUnitTest.c TestHelpers/Helpers.c
SchedulerGetterUnitTest := SchedulerGetterUnitTests/SchedulerGetterUnitTest.c TestHelpers/Helpers.c


# Output executable
OUT_EXE := all.exe

# Default target: build src library and compile all unit tests
all: ../Src/libcore.a

# Build src library first
../Src/libcore.a:
	$(MAKE) -C ../Src

# Compile all .c files in one command
$(OUT_EXE): ../Src/libcore.a $(TEST_SRCS)
	$(CC) $(CFLAGS) FifoUnitTest ../Src/libcore.a \
		-o $(OUT_EXE) \
		-DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"

# Run the tests
run: all
	mkdir -p Executables
	@echo "Running unit tests..."
	$(CC) $(CFLAGS) $(FifoUnitTest) ../Src/libcore.a -o Executables/FifoUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	$(CC) $(CFLAGS) $(AddHeadUnitTest) ../Src/libcore.a -o Executables/AddHeadUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	$(CC) $(CFLAGS) $(CreateListUnitTest) ../Src/libcore.a -o Executables/CreateListUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	$(CC) $(CFLAGS) $(MultilevelUnitTest) ../Src/libcore.a -o Executables/MultilevelUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	$(CC) $(CFLAGS) $(ParserUnitTest) ../Src/libcore.a -o Executables/ParserUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	$(CC) $(CFLAGS) $(PreemptivePriorityUnitTest) ../Src/libcore.a -o Executables/PreemptivePriorityUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	$(CC) $(CFLAGS) $(QueueUnitTest) ../Src/libcore.a -o Executables/QueueUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	$(CC) $(CFLAGS) $(RoundRobinUnitTest) ../Src/libcore.a -o Executables/RoundRobinUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	$(CC) $(CFLAGS) $(SchedulerGetterUnitTest) ../Src/libcore.a -o Executables/SchedulerGetterUnitTest -DTEST_FILES_PATH=\"$(TEST_FILES_PATH)\"
	./Executables/FifoUnitTest
	./Executables/AddHeadUnitTest
	./Executables/CreateListUnitTest
	./Executables/MultilevelUnitTest
	./Executables/ParserUnitTest
	./Executables/PreemptivePriorityUnitTest
	./Executables/QueueUnitTest
	./Executables/RoundRobinUnitTest
	./Executables/SchedulerGetterUnitTest
	@echo "All tests passed successfully !"

# Clean generated files
clean:
	rm -r Executables

.PHONY: all run clean
