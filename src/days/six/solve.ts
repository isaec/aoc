// deno-lint-ignore-file require-await
import {} from "@util/set.ts";
import {} from "@util/collect.ts";
import Executor from "@util/executor.ts";

/* Here are a few more examples:

bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 5
nppdvjthqldpwncqszvftbrmjlhg: first marker after character 6
nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 10
zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 11

*/

const ex = new Executor(import.meta.url);

const allDifferent = (ch: string[]) => new Set(ch).size === ch.length;

await ex.part1(async ({ text, lines }, console) => {
  // detect first four characters that are all different

  let processed = 0;

  const chars = text.split("");
  const charSection: string[] = [];
  for (let i = 0; i < 4; i++) {
    charSection.unshift(chars.shift()!);
    processed++;
  }

  while (!allDifferent(charSection)) {
    // console.log("section", charSection.join(""));
    charSection.unshift(chars.shift()!);
    charSection.pop();
    processed++;
  }

  return processed;
});

await ex.testPart1([
  ex.c`
bvwbjplbgvbhsrlpgdmjqwftvncz
`(5),

  ex.c`
zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw
`(11),
]);

const size = 14;
await ex.part2(async ({ text, lines }, console) => {
  const chars = text.split("");

  let processed = 0;

  while (!allDifferent(chars.slice(processed, processed + size))) processed++;

  return processed + size;
});

await ex.testPart2([
  ex.c`
mjqjpqmgbljsphdztnvjfqwrcgsmlb
`(19),

  ex.c`
nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg
`(29),
]);
