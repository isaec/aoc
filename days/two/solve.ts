import { readInput } from "../util.ts";

const { lines, text } = await readInput(import.meta.url);

const moves = {
  Rock: "Rock",
  Paper: "Paper",
  Scissors: "Scissors",
} as const;
type Moves = typeof moves[keyof typeof moves];

const moveMap = new Map<string, Moves>([
  ["A", "Rock"],
  ["B", "Paper"],
  ["C", "Scissors"],
  ["X", "Rock"],
  ["Y", "Paper"],
  ["Z", "Scissors"],
]);

const shapeScore = new Map<Moves, number>([
  ["Rock", 1],
  ["Paper", 2],
  ["Scissors", 3],
]);

type PlayInstruct = "X" | "Y" | "Z";
const playMap = new Map<PlayInstruct, (them: Moves) => Moves>([
  // we need to loose
  [
    "X",
    (them) => {
      if (them === "Rock") return "Scissors";
      if (them === "Paper") return "Rock";
      return "Paper";
    },
  ],
  // draw
  ["Y", (them) => them],
  // we need to win
  [
    "Z",
    (them) => {
      if (them === "Rock") return "Paper";
      if (them === "Paper") return "Scissors";
      return "Rock";
    },
  ],
]);

let totalScore = 0;

for (const line of lines) {
  const [them, me] = line.split(" ");
  const themMove = moveMap.get(them)!;
  const myInstruct = me as PlayInstruct;
  const myMove = playMap.get(myInstruct)!(themMove);

  console.log({ me, themMove, myMove });

  // play the instruct
  const score = shapeScore.get(myMove)!;
  totalScore += score;

  // give points based on game outcome
  if (me === "Y") {
    totalScore += 3;
  }
  if (me === "Z") {
    totalScore += 6;
  }
}

console.log(totalScore);
