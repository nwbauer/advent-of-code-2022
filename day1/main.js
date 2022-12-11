const fs = require("fs");

const input = fs.readFileSync("./input.txt").toString();
const caloriesPerElfStrings = input.split("\n\n");
const caloriesPerElf = caloriesPerElfStrings.map((elfCaloriesString) => {
  const calories = elfCaloriesString.split("\n");
  const totalCalories = calories.reduce((total, calories) => total + parseInt(calories), 0);
  return {
    elfCaloriesString,
    calories,
    totalCalories
  }
}).sort((a, b) => b.totalCalories - a.totalCalories);

console.log('caloriesPerElf', caloriesPerElf);
const maxCalories = caloriesPerElf[0].totalCalories;
const topThreeCalories =
  caloriesPerElf[0].totalCalories + caloriesPerElf[1].totalCalories + caloriesPerElf[2].totalCalories;

console.log("solution:", maxCalories);
console.log("[part 1] elf with max calories:", maxCalories);
console.log("[part 2] sum of top three calorie elfs:", topThreeCalories);
