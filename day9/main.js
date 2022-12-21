const fs = require("fs");

function moveUp({ x, y }) {
  return { x, y: y + 1 };
}

function moveDown({ x, y }) {
  return { x, y: y - 1 };
}

function moveLeft({ x, y }) {
  return { x: x - 1, y };
}

function moveRight({ x, y }) {
  return { x: x + 1, y };
}

function getNextStates(direction, distance, initialKnotState) {
  const nextStates = [];
  const totalKnots = initialKnotState.length;
  // console.log("move", direction, distance);
  for (let i = 0; i < parseInt(distance); i++) {
    const nextKnotState = [];
    const currentKnotState =
      nextStates.length === 0
        ? initialKnotState
        : nextStates[nextStates.length - 1];

    // move head
    if (direction === "U") {
      nextKnotState[0] = moveUp(currentKnotState[0]);
    } else if (direction === "D") {
      nextKnotState[0] = moveDown(currentKnotState[0]);
    } else if (direction === "L") {
      nextKnotState[0] = moveLeft(currentKnotState[0]);
    } else if (direction === "R") {
      nextKnotState[0] = moveRight(currentKnotState[0]);
    } else {
      throw new Error("cannot move. do not understand direction");
    }

    // move tailing knots
    for (let i = 1; i < totalKnots; i++) {
      const xDiff = nextKnotState[i - 1].x - currentKnotState[i].x
      const yDiff = nextKnotState[i - 1].y - currentKnotState[i].y
      const xDistance = Math.abs(xDiff);
      const yDistance = Math.abs(yDiff);

      const sameColumn = xDistance === 0;
      const sameRow = yDistance === 0;

      if (xDistance > 1 || yDistance > 1) {
          nextKnotState[i] = { 
            x: currentKnotState[i].x + Math.sign(xDiff),
            y: currentKnotState[i].y + Math.sign(yDiff)
          };
      } else {
        // no need to move
        nextKnotState[i] = { ...currentKnotState[i] };
      }
    }

    nextStates.push(nextKnotState);
  }
  // console.log(nextStates);
  return nextStates;
}

function moveRope(numberOfKnots) {
  const input = fs.readFileSync("./input.txt").toString();
  const moves = input.split("\n").map((row) => row.split(" "));
  const knotsInitialState = Array(numberOfKnots).fill({
    x: 0,
    y: 0,
  });
  let knotHistory = [knotsInitialState];

  moves.forEach(([direction, distance]) => {
    const currentState = knotHistory[knotHistory.length - 1];
    const nextStates = getNextStates(direction, distance, currentState);
    knotHistory = knotHistory.concat(nextStates);
  });

  const tailUniqueLocationsMap = knotHistory.reduce((set, state) => {
    set[JSON.stringify(state[numberOfKnots - 1])] = true;
    return set;
  }, {});

  return Object.keys(tailUniqueLocationsMap).length;
}


console.log("[part1] tail unique locations", moveRope(2));
console.log("[part2] tail unique locations", moveRope(10));
