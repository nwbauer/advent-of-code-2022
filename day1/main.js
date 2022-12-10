const fs = require("fs");

const input = fs.readFileSync("./input.txt").toString();
const caloriesPerElfStrings = input.split("\n\n");
const caloriesPerElf = caloriesPerElfStrings.map((elfCaloriesString) =>
  elfCaloriesString.split("\n")
);

const totalElfCalories = caloriesPerElf.map((calories) => {
  return calories.reduce((total, calories) => total + parseInt(calories), 0);
});

const sortedElfCalories = totalElfCalories.sort((a, b) => b - a);

const maxCalories = sortedElfCalories[0];
console.log("Part 1 answer:", maxCalories);

const topThreeCalories =
  sortedElfCalories[0] + sortedElfCalories[1] + sortedElfCalories[2];
console.log("Part 2 answer:", topThreeCalories);
