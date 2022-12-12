const fs = require("fs");

function isSubset(setA, setB) {
  if (setA[1] === setB[1]) {
    return true;
  } else if (setA[0] === setB[0]) {
    return true;
  } else {
    const largerMax = setA[1] >= setB[1] ? setA : setB;
    const smallerMax = largerMax === setB ? setA : setB;
    return largerMax[0] <= smallerMax[0];
  }
}

function hasIntersection(setA, setB) {
  if (setA[1] === setB[1]) {
    return true;
  } else if (setA[0] === setB[0]) {
    return true;
  } else {
    const largerMax = setA[1] >= setB[1] ? setA : setB;
    const smallerMax = largerMax === setB ? setA : setB;
    return largerMax[0] <= smallerMax[1];
  }
}

const input = fs.readFileSync("./input.txt").toString();

const assignmentPairs = input.split("\n").map((assignmentString) => {
  const assignments = assignmentString
    .split(",")
    .map((rangeString) => rangeString.split("-").map((v) => parseInt(v)));
  return {
    assignmentString,
    assignments,
    isSubset: isSubset(...assignments),
    hasIntersection: hasIntersection(...assignments),
  };
});

function part1() {
  return assignmentPairs.reduce(
    (count, assignmentPair) => (assignmentPair.isSubset ? count + 1 : count),
    0
  );
}

function part2() {
  return assignmentPairs.reduce(
    (count, assignmentPair) =>
      assignmentPair.hasIntersection ? count + 1 : count,
    0
  );
}

console.log(JSON.stringify(assignmentPairs, null, 2));

console.log("[part 1] sets that contain each other", part1());
console.log("[part 2] sets that have intersection", part2());
