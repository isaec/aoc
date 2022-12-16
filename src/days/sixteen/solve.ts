// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";
import { Graph } from "@util/collections/Graph.ts";

// There's even a valve in the room you and the elephants are currently standing in labeled AA. You estimate it will take you one minute to open a single valve and one minute to follow any tunnel from one valve to another. What is the most pressure you could release?

const ex = new Executor(import.meta.url);

const exampleInput = ex.c`
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  const graph = new Graph<string>();

  const valves = new Map<string, number>();

  const closedValves = new Set<string>();
  const openValves = new Set<string>();

  for (const line of lines) {
    const [, name, flowRate] = line.match(/Valve (\w+) has flow rate=(\d+);/)!;
    // console.log({ name, flowRate });
    valves.set(name, Number(flowRate));
    if (flowRate !== "0") closedValves.add(name);

    // console.log(line);

    const tunnels = line
      .match(/tunnels? leads? to valves? (\w+(?:, \w+)*)/)![1]
      .split(", ");

    // console.log(tunnels);

    graph.addEdges(name, tunnels);
  }

  type EvalChoice = {
    valve: string;
    cost: number;
    value: number;
    path: string[];
  };

  const pathCache = new Map<string, string[]>();
  const getPath = (from: string, to: string): readonly string[] => {
    const key = `${from} -> ${to}`;
    if (pathCache.has(key)) return pathCache.get(key)!;
    const path = graph.shortestPath(from, to)!;
    pathCache.set(key, path);
    return path;
  };

  const getChoices = (currentValve: string, remainingTime: number) => {
    const choices = Array.from(closedValves.keys());

    const evalChoices: EvalChoice[] = [];

    for (const choice of choices) {
      const path = graph.shortestPath(currentValve, choice)!.slice(1);
      const cost = path.length + 1; // add one for opening the valve
      const value = valves.get(choice)! * (remainingTime - cost);
      evalChoices.push({ valve: choice, cost, value, path });
    }

    return evalChoices.sort((a, b) => b.value - a.value);
  };

  const evaluatePosition = (
    choice: EvalChoice,
    currentValve: string,
    remainingTime: number,
    totalFlow: number
  ): number => {
    // O1 knapsack
    const bestChoice = choices.find((choice) => choice.cost <= remainingTime);

    if (!bestChoice) {
      return totalFlow;
    }

    const { valve, cost, value, path } = bestChoice;

    totalFlow += value;
    remainingTime -= cost;

    closedValves.delete(valve);
    openValves.add(valve);

    return totalFlow;
  };

  const choices = getChoices("AA", 30);

  return choices
    .map((choice) => evaluatePosition(choice, "AA", 30, 0))
    .sort((a, b) => b - a)[0];
});

await ex.testPart1([
  exampleInput(1651)(true),

  ex.c`
input
`()(false),
]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {});

await ex.testPart2([
  exampleInput()(true),

  ex.c`
input
`()(false),
]);
