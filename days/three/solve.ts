import { readInput } from "../util.ts";

const { lines, text } = await readInput(import.meta.url);

const priorityStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const getPriority = (c: string) => priorityStr.indexOf(c) + 1;

let sum = 0;

// for (const line of lines) {
//   // split line in half by length
//   // line has no spaces
//   const half = line.length / 2;
//   const firstHalf = line.slice(0, half);
//   const secondHalf = line.slice(half);

//   // find the item in both halves
//   const item = firstHalf.split("").find((c) => secondHalf.includes(c));
//   if (item === undefined) throw Error("no item found");

//   // add to sum
//   sum += getPriority(item);
// }

// pt2

// take the lines in chunks of 3
for (let i = 0; i < lines.length; i += 3) {
  const first = lines[i];
  const second = lines[i + 1];
  const third = lines[i + 2];

  // find the item in all three
  const item = first
    .split("")
    .find((c) => second.includes(c) && third.includes(c));
  if (item === undefined) throw Error("no item found");

  // add to sum
  sum += getPriority(item);
}

console.log(sum);
