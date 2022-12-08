// deno-lint-ignore-file require-await
import {} from "@util/set.ts";

import Executor from "@util/executor.ts";

/* the example input
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
*/

const ex = new Executor(import.meta.url);

const commandRegex = /^\$ (\w+)(?: (.*))?$/;

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // goal: Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?
  let currentDir: string[] = [];
  const fileSizes = new Map<string, number>();

  for (const line of lines) {
    const isCommand = line.startsWith("$");
    // use regex to parse the command
    const commandMatch = line.match(commandRegex);
    if (isCommand && commandMatch) {
      console.log("is command", commandMatch);
      const [_, command, args] = commandMatch;
      if (command === "cd") {
        if (args === "..") {
          currentDir.pop();
        } else if (args === "/") {
          currentDir = [];
        } else {
          console.log("add dir", args);
          currentDir.push(args);
        }
      } else if (command === "ls") {
        // do nothing
      } else {
        console.log("unknown command", command, args);
      }
    }
    // if it's not a command, it's a file
    else {
      const [size, name] = line.split(" ");
      if (size === "dir") continue;
      const dir = currentDir.join("/") + "/" + name;
      fileSizes.set(dir, parseInt(size));
    }
  }
  console.log(fileSizes);

  const totalSizes = new Map<string, number>();
  // calculate the total size of each directory
  // ignore actual files
  for (const [path, size] of fileSizes) {
    const dirs = path.split("/");
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs.slice(0, i + 1).join("/");
      const total = totalSizes.get(dir) ?? 0;
      if (fileSizes.has(dir)) continue;
      totalSizes.set(dir, total + size);
    }
  }
  // find all directories with a total size of at most 100000
  const dirs = [...totalSizes.entries()].filter(
    ([path, size]) => size <= 100000
  );

  // what is the sum of the total sizes of those directories?
  const sum = dirs.reduce((acc, [path, size]) => acc + size, 0);
  return sum;
});

await ex.testPart1([
  ex.c`
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`(95437),

  ex.c`
input
`(),
]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {
  // goal: Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?
  let currentDir: string[] = [];
  const fileSizes = new Map<string, number>();

  for (const line of lines) {
    const isCommand = line.startsWith("$");
    // use regex to parse the command
    const commandMatch = line.match(commandRegex);
    if (isCommand && commandMatch) {
      console.log("is command", commandMatch);
      const [_, command, args] = commandMatch;
      if (command === "cd") {
        if (args === "..") {
          currentDir.pop();
        } else if (args === "/") {
          currentDir = [];
        } else {
          console.log("add dir", args);
          currentDir.push(args);
        }
      } else if (command === "ls") {
        // do nothing
      } else {
        console.log("unknown command", command, args);
      }
    }
    // if it's not a command, it's a file
    else {
      const [size, name] = line.split(" ");
      if (size === "dir") continue;
      const dir = currentDir.join("/") + "/" + name;
      fileSizes.set(dir, parseInt(size));
    }
  }
  console.log(fileSizes);

  const totalSizes = new Map<string, number>();
  // calculate the total size of each directory
  // ignore actual files
  for (const [path, size] of fileSizes) {
    const dirs = path.split("/");
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs.slice(0, i + 1).join("/");
      const total = totalSizes.get(dir) ?? 0;
      if (fileSizes.has(dir)) continue;
      totalSizes.set(dir, total + size);
    }
  }

  console.log(totalSizes);

  const totalSize = 70000000;
  const upgradeSize = 30000000;
  const usedSize = [...fileSizes.values()].reduce((acc, size) => acc + size, 0);
  const freeSize = totalSize - usedSize;
  const neededSize = upgradeSize - freeSize;

  console.log({
    usedSize,
    freeSize,
  });

  // find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update
  // The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.
  // const currentFreeSpace = 70000000 - [...fileSizes.values()].reduce(
  //   (acc, size) => acc + size,
  //   0
  // );

  const dirs = [...totalSizes.entries()]
    .filter(([path, size]) => path !== "")
    .filter(([path, size]) => size >= neededSize)
    .sort((a, b) => a[1] - b[1]);

  // what is the total size of that directory?
  const sum = dirs[0][1];
  return sum;
});

await ex.testPart2([
  ex.c`
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`(24933642),

  ex.c`
input
`(),
]);
