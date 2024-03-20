#!/bin/bash

EXTRA_ARG=$1

if [ ! -z "$EXTRA_ARG" ]; then
    if [ "$EXTRA_ARG" -lt 1000 ] || [ "$EXTRA_ARG" -gt 100000 ]; then
        echo "\033[31mError: trace duration must be between 1000 and 100000.\033[0m"
        exit 1
    fi
fi

for i in 0 1 2 3 4 5 6 7 8
do
    echo "\033[32mRunning benchmark for wasm with $i worker(s)\033[0m"
    if [ -z "$EXTRA_ARG" ]; then
        node benchmarks/scripts/benchmark.js wasm $i
    else
        node benchmarks/scripts/benchmark.js wasm $i $EXTRA_ARG
    fi
done

for i in 0 1 2 3 4 5 6 7 8
do
    echo "\033[32mRunning benchmark for js with $i worker(s)\033[0m"
    if [ -z "$EXTRA_ARG" ]; then
        node benchmarks/scripts/benchmark.js js $i
    else
        node benchmarks/scripts/benchmark.js js $i $EXTRA_ARG
    fi
done
