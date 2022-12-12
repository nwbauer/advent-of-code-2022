const { groupEnd } = require("console");
const fs = require("fs");

function getItemValue(item) {
  if (item.toLowerCase() === item) {
    return item.charCodeAt() - 96;
  } else {
    return item.charCodeAt() - 38;
  }
}

function findCommonItem([fistString, ...otherStrings]) {
  const itemSet = [...fistString].reduce((commonItems, item) => {
    const isContainedInOthers = otherStrings.every((otherString) =>
      otherString.includes(item)
    );
    if (isContainedInOthers) {
      commonItems.add(item);
    }
    return commonItems;
  }, new Set());
  return [...itemSet];
}

const input = fs.readFileSync("./input.txt").toString();

const ruckSacks = input.split("\n").map((rucksackString) => {
  if (rucksackString.length % 2 !== 0) {
    throw new Error("rucksack has an odd number of contents", rucksackString);
  }
  const compartments = [
    rucksackString.slice(0, rucksackString.length / 2),
    rucksackString.slice(rucksackString.length / 2),
  ];
  const commonItems = findCommonItem(compartments);
  const itemValue = commonItems.reduce(
    (totalValue, item) => totalValue + getItemValue(item),
    0
  );

  return {
    rucksackString,
    compartments,
    commonItems: commonItems,
    itemValue,
  };
});
// console.log(JSON.stringify(ruckSacks, null, 2));

function part1() {
  return ruckSacks.reduce((total, ruckSack) => total + ruckSack.itemValue, 0);
}

function part2() {
  const groups = ruckSacks.reduce((groups, ruckSack, i) => {
    const groupNumber = Math.ceil((i + 1) / 3);
    groups[groupNumber] = groups[groupNumber] || { ruckSacks: [] };
    groups[groupNumber].ruckSacks.push(ruckSack);
    return groups;
  }, []);

  const extendedGroups = groups.map((group) => {
    const commonItems = findCommonItem(
      group.ruckSacks.map((ruckSack) => ruckSack.rucksackString)
    );
    const itemValue = commonItems.reduce(
      (totalValue, item) => totalValue + getItemValue(item),
      0
    );
    return {
      ...group,
      commonItems,
      itemValue,
    };
  });

  // console.log("extendedGroups", JSON.stringify(extendedGroups, null, 2));
  return extendedGroups.reduce(
    (total, compartment) => total + compartment.itemValue,
    0
  );
}

console.log("[part 1] rucksack value:", part1());
console.log("[part 2] groups of three rucksack value:", part2());
