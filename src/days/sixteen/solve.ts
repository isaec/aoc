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

  const startingClosedValves = new Set<string>();

  for (const line of lines) {
    const [, name, flowRate] = line.match(/Valve (\w+) has flow rate=(\d+);/)!;
    // console.log({ name, flowRate });
    valves.set(name, Number(flowRate));
    if (flowRate !== "0") startingClosedValves.add(name);

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
  };

  type State = {
    currentValve: string;
    remainingTime: number;
    totalFlow: number;
    closedValves: Set<string>;
  };

  const pathCache = new Map<string, number>();
  const getPathLength = (from: string, to: string): number => {
    const key = `${from} -> ${to}`;
    if (pathCache.has(key)) return pathCache.get(key)!;
    const pathLength = graph.shortestPath(from, to)!.length;
    pathCache.set(key, pathLength);
    return pathLength;
  };

  const getChoices = (state: State) => {
    const choices = Array.from(state.closedValves.keys());

    const evalChoices: EvalChoice[] = [];

    for (const choice of choices) {
      const cost = getPathLength(state.currentValve, choice);
      const value = valves.get(choice)! * (state.remainingTime - cost);
      evalChoices.push({ valve: choice, cost, value });
    }

    return evalChoices.sort((a, b) => b.value - a.value);
  };

  const applyChoice = (choice: EvalChoice, state: State) => {
    state.totalFlow += choice.value;
    state.remainingTime -= choice.cost;
    state.currentValve = choice.valve;
    state.closedValves.delete(choice.valve);
  };

  const copyState = (state: State): State => ({
    currentValve: state.currentValve,
    remainingTime: state.remainingTime,
    totalFlow: state.totalFlow,
    closedValves: new Set(state.closedValves),
  });

  const getBestBranchFlow = (state: State): number => {
    const choices = getChoices(state);
    const flows = choices.map((choice) => {
      const nextState = copyState(state);
      if (choice.cost > nextState.remainingTime) {
        return state.totalFlow;
      }
      applyChoice(choice, nextState);
      if (nextState.closedValves.size === 0) {
        return nextState.totalFlow;
      }
      return getBestBranchFlow(nextState);
    });

    return Math.max(...flows);
  };

  return getBestBranchFlow({
    currentValve: "AA",
    remainingTime: 30,
    totalFlow: 0,
    closedValves: startingClosedValves,
  });
});

// await ex.testPart1([
//   exampleInput(1651)(true),

//   ex.c`
// input
// `()(false),
// ]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {
  const graph = new Graph<string>();

  const valves = new Map<string, number>();

  const startingClosedValves = new Set<string>();

  for (const line of lines) {
    const [, name, flowRate] = line.match(/Valve (\w+) has flow rate=(\d+);/)!;
    // console.log({ name, flowRate });
    valves.set(name, Number(flowRate));
    if (flowRate !== "0") startingClosedValves.add(name);

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
  };

  type State = {
    currentValve: string;
    remainingTime: number;
    totalFlow: number;
    closedValves: Set<string>;
  };

  const pathCache = new Map<string, number>();
  const getPathLength = (from: string, to: string): number => {
    const key = `${from} -> ${to}`;
    if (pathCache.has(key)) return pathCache.get(key)!;
    const pathLength = graph.shortestPath(from, to)!.length;
    pathCache.set(key, pathLength);
    return pathLength;
  };

  const getChoices = (state: State) => {
    const choices = Array.from(state.closedValves.keys());

    const evalChoices: EvalChoice[] = [];

    for (const choice of choices) {
      const cost = getPathLength(state.currentValve, choice);
      const value = valves.get(choice)! * (state.remainingTime - cost);
      evalChoices.push({ valve: choice, cost, value });
    }

    return evalChoices.sort((a, b) => b.value - a.value);
  };

  const applyChoice = (choice: EvalChoice, state: State) => {
    state.totalFlow += choice.value;
    state.remainingTime -= choice.cost;
    state.currentValve = choice.valve;
    state.closedValves.delete(choice.valve);
  };

  const copyState = (state: State): State => ({
    currentValve: state.currentValve,
    remainingTime: state.remainingTime,
    totalFlow: state.totalFlow,
    closedValves: new Set(state.closedValves),
  });

  const getBestBranchFlow = (state: State): number => {
    const choices = getChoices(state);
    const flows = choices.map((choice) => {
      const nextState = copyState(state);
      if (choice.cost > nextState.remainingTime) {
        return state.totalFlow;
      }
      applyChoice(choice, nextState);
      if (nextState.closedValves.size === 0) {
        return nextState.totalFlow;
      }
      return getBestBranchFlow(nextState);
    });

    return Math.max(...flows);
  };

  return getBestBranchFlow({
    currentValve: "AA",
    remainingTime: 30,
    totalFlow: 0,
    closedValves: startingClosedValves,
  });
});

await ex.testPart2([
  exampleInput(1707)(false),

  ex.c`
input.txt
`(1737)(true),
]);
