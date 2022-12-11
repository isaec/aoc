#!/usr/bin/env fish

clear

deno run --v8-flags=--max-old-space-size=8000 --allow-all --unstable ./src/days/$argv[1]/solve.ts
