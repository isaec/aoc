#!/usr/bin/env fish

clear

deno run --allow-all --watch ./days/$argv[1]/solve.ts
