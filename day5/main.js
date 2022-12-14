const fs = require("fs");

function getStacks(stackString) {
  const [keyString, ...stackStrings] = stackString.split("\n").reverse();

  const keyMap = [...keyString].reduce((res, char, i) => {
    if (char !== " ") {
      res[parseInt(char) - 1] = i;
    }
    return res;
  }, []);

  const stackMatrix = stackStrings.map((stackString) => {
    return keyMap.map((charIdx) => stackString[charIdx]);
  });

  return stackMatrix.reduce((columns, row) => {
    row.forEach((item, colIdx) => {
      if (item !== " ") {
        columns[colIdx] = columns[colIdx] || [];
        columns[colIdx].push(item);
      }
    });
    return columns;
  }, []);
}

function getMoves(moveString) {
  const encodedMoves = moveString
    .replaceAll("move ", "")
    .replaceAll(" from ", "-")
    .replaceAll(" to ", "-")
    .split("\n");
  return encodedMoves.map((moveString) => {
    const [quantity, fromColumn, toColumn] = moveString.split("-");
    return {
      quantity,
      fromColumn,
      toColumn,
    };
  });
}

function applyMoveCreateMover9000(move, stacks) {
  for (let i = 0; i < move.quantity; i++) {
    const item = stacks[move.fromColumn - 1].pop();
    if (item === undefined) {
      throw new Error("nothing to move", move);
    }
    stacks[move.toColumn - 1].push(item);
  }
}

function applyMoveCreateMover9001(move, stacks) {
  const moveArray = [];
  for (let i = 0; i < move.quantity; i++) {
    const item = stacks[move.fromColumn - 1].pop();
    if (item === undefined) {
      throw new Error("nothing to move");
    }
    moveArray.unshift(item);
  }
  stacks[move.toColumn - 1] = [...stacks[move.toColumn - 1], ...moveArray];
}

function part1() {
  const input = fs.readFileSync("./input.txt").toString();
  const [stackString, moveString] = input.split("\n\n");
  const stacks = getStacks(stackString);
  const moves = getMoves(moveString);
  // console.log('stacks', stacks, moves);
  moves.forEach((move) => applyMoveCreateMover9000(move, stacks));
  return stacks.map((stack) => stack[stack.length - 1]).join("");
}

function part2() {
  const input = fs.readFileSync("./input.txt").toString();
  const [stackString, moveString] = input.split("\n\n");
  const stacks = getStacks(stackString);
  const moves = getMoves(moveString);
  // console.log('stacks', stacks, moves);
  moves.forEach((move) => applyMoveCreateMover9001(move, stacks));
  return stacks.map((stack) => stack[stack.length - 1]).join("");
}

console.log("[part 1]", part1());
console.log("[part 2]", part2());
