// read input.txt as a string
const input = Deno.readTextFileSync("./input.txt");

// split input into lines
const lines = input.split("\n");

const caloryArray = [];

let currentCalories = 0;
for (const line of lines) {
  if (line === "") {
    caloryArray.push(currentCalories);
    currentCalories = 0;
    continue;
  }
  const calories = parseInt(line);
  currentCalories += calories;
}
// add the last one
caloryArray.push(currentCalories);

// sort the array
caloryArray.sort((a, b) => a - b);

// print top 3
console.log("top3", caloryArray.slice(-3));

// add them together
console.log(
  "total",
  caloryArray.slice(-3).reduce((a, b) => a + b, 0)
);
