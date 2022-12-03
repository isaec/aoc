#!/usr/bin/env fish

clear

deno run --allow-all --unstable --watch ./days/$argv[1]/solve.ts
