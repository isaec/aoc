// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";

/* the example input
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
*/

const ex = new Executor(import.meta.url);

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // goal: Simulate your complete hypothetical series of motions. How many positions does the tail of the rope visit at least once?
  const moves = lines.map((line): ["R" | "U" | "L" | "D", number] => [
    line[0] as "R",
    Number(line.slice(1)),
  ]);
  // console.log(moves);

  let headPos: Pos = [0, 0];
  let tailPos: Pos = [0, 0];
  type Pos = [number, number];
  const cordToPos = (cord: string) => cord.split(",").map(Number);
  const posToCord = (pos: number[]) => pos.join(",");

  const distance = (a: [number, number], b: [number, number]): number =>
    Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);

  /** positions visited by the tail */
  const visited = new Set<string>();
  visited.add(posToCord(tailPos));

  for (const [dir, dist] of moves) {
    for (let i = 0; i < dist; i++) {
      let [x, y] = headPos;
      switch (dir) {
        case "R":
          x += 1;
          break;
        case "U":
          y += 1;
          break;
        case "L":
          x -= 1;
          break;
        case "D":
          y -= 1;
          break;
      }
      headPos = [x, y];

      console.log({
        headPos,
        tailPos,
        dist: distance(headPos, tailPos),
      });

      if (distance(headPos, tailPos) >= 2) {
        // we need to move the tail and align it on an axis with the head
        let [tx, ty] = tailPos;
        console.log({ tx, ty, x, y, dir });
        // we need to align with the axis we didn't move on
        if (dir === "R" || dir === "L") {
          if (y != ty) {
            // align y
            if (y > ty) {
              ty += 1;
            } else {
              ty -= 1;
            }
          }
        } else {
          if (x != tx) {
            // align x
            if (x > tx) {
              tx += 1;
            } else {
              tx -= 1;
            }
          }
        }
        console.log({ tx, ty });
        tailPos = [tx, ty];
      }
      if (distance(headPos, tailPos) > 1.5) {
        // move tail
        let [tx, ty] = tailPos;
        switch (dir) {
          case "R":
            tx += 1;
            break;
          case "U":
            ty += 1;
            break;
          case "L":
            tx -= 1;
            break;
          case "D":
            ty -= 1;
            break;
        }
        tailPos = [tx, ty];
      }

      console.log(
        "now",
        {
          headPos,
          tailPos,
          dist: distance(headPos, tailPos),
        },
        "\n"
      );

      visited.add(posToCord(tailPos));
    }
  }

  return visited.size;
});

await ex.testPart1([
  ex.c`
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`(13),

  ex.c`
input
`(),
]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {
  // goal: Simulate your complete series of motions on a larger rope with ten knots. How many positions does the tail of the rope visit at least once?
  const moves = lines.map((line): ["R" | "U" | "L" | "D", number] => [
    line[0] as "R",
    Number(line.slice(1)),
  ]);
  // console.log(moves);

  type Pos = [number, number];
  const nodes: Readonly<Pos[]> = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  const cordToPos = (cord: string) => cord.split(",").map(Number);
  const posToCord = (pos: number[]) => pos.join(",");

  const distance = (a: [number, number], b: [number, number]): number =>
    Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);

  /** positions visited by the tail */
  const visited = new Set<string>();
  visited.add(posToCord(nodes[nodes.length - 1]));

  const setNodePos = (node: number, pos: Pos) => {
    if (node >= nodes.length || node < 0) throw new Error("node out of bounds");
    nodes[node][0] = pos[0];
    nodes[node][1] = pos[1];
  };

  let move = 0;

  const printBoard = () => {
    const maxX = 15;
    const maxY = 10;

    console.log(`--- board ${lines[move - 1]} -`);
    for (let y = maxY; y >= -maxY; y--) {
      let line = "";
      for (let x = -maxX; x <= maxX; x++) {
        let val = "";
        if (x === 0 && y === 0) val = "S";
        if (nodes.some(([nx, ny]) => nx === x && ny === y)) {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i][0] === x && nodes[i][1] === y) {
              val = i.toString();
              break;
            }
          }
          if (nodes[0][0] === x && nodes[0][1] === y) {
            val = "H";
          }
        } else {
          val = ".";
        }
        line += val;
      }
      console.log(line);
    }
    console.log("--- board ---\n");
  };

  const updateHead = (dir: "R" | "U" | "L" | "D") => {
    let [x, y] = nodes[0];
    switch (dir) {
      case "R":
        x += 1;
        break;
      case "U":
        y += 1;
        break;
      case "L":
        x -= 1;
        break;
      case "D":
        y -= 1;
        break;
    }
    setNodePos(0, [x, y]);
  };

  const updateNode = (
    dir: "R" | "U" | "L" | "D",
    node: number
  ): "R" | "U" | "L" | "D" => {
    if (node >= nodes.length || node < 1) throw new Error("node out of bounds");
    const headPos = nodes[node - 1];
    const [x, y] = headPos;
    let tailPos = nodes[node];
    const [tx, ty] = tailPos;

    if (distance(headPos, tailPos) >= 2) {
      // we need to move the tail and align it on an axis with the head
      let [tx, ty] = tailPos;
      // console.log({ tx, ty, x, y, dir });
      // we need to align with the axis we didn't move on
      if (dir === "R" || dir === "L") {
        if (y != ty) {
          // align y
          if (y > ty) {
            ty += 1;
          } else {
            ty -= 1;
          }
        }
      } else {
        if (x != tx) {
          // align x
          if (x > tx) {
            tx += 1;
          } else {
            tx -= 1;
          }
        }
      }
      // console.log({ tx, ty });
      tailPos = [tx, ty];
    }
    if (distance(headPos, tailPos) > 1.5) {
      // move tail
      let [tx, ty] = tailPos;
      switch (dir) {
        case "R":
          tx += 1;
          break;
        case "U":
          ty += 1;
          break;
        case "L":
          tx -= 1;
          break;
        case "D":
          ty -= 1;
          break;
      }
      tailPos = [tx, ty];
    }

    // determine the direction the tail was moved
    let newDir = dir;
    if (tailPos[0] > tx) {
      newDir = "R";
    } else if (tailPos[0] < tx) {
      newDir = "L";
    } else if (tailPos[1] > ty) {
      newDir = "U";
    } else if (tailPos[1] < ty) {
      newDir = "D";
    }

    setNodePos(node, tailPos);

    return newDir;
  };

  printBoard();

  for (const [dir, dist] of moves) {
    move++;

    for (let i = 0; i < dist; i++) {
      updateHead(dir);

      let lastMove = dir;

      for (let node = 1; node < nodes.length; node++) {
        lastMove = updateNode(lastMove, node);
      }

      visited.add(posToCord(nodes[nodes.length - 1]));
    }
    printBoard();
  }

  return visited.size;
});

await ex.testPart2([
  //   ex.c`
  // R 4
  // U 4
  // L 3
  // D 1
  // R 4
  // D 1
  // L 5
  // R 2
  //   `(1),

  //   ex.c`
  // R 5
  // U 8
  // L 8
  //   `(),

  ex.c`
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
    `(36),
]);
