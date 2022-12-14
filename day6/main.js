const fs = require("fs");

function findFirstDistinctCharString(input, length) {
  return [...input].findIndex((_, i) => {
    const startIndex = i - length;
    if (startIndex < 0) {
      return false;
    }
    const markerCandidate = input.slice(startIndex, i);
    // console.log(i, markerCandidate)
    return [...markerCandidate].every((char, j) => markerCandidate.indexOf(char) === j);
  });
}

function part1() {
  const input = fs.readFileSync("./input.txt").toString();
  console.log(input);
  const markerIndex = findFirstDistinctCharString(input, 4);
  return markerIndex;
}

function part2() {
  const input = fs.readFileSync("./input.txt").toString();
  console.log(input);
  const markerIndex = findFirstDistinctCharString(input, 14);
  return markerIndex;
}


console.log('part 1', part1());
console.log('part 2', part2());