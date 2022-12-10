const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString();
const caloriesPerElfStrings = input.split('\n\n');
const caloriesPerElf = caloriesPerElfStrings.map((elfCaloriesString) => elfCaloriesString.split('\n'));

const totalElfCalories = caloriesPerElf.map((calories) => {
  return calories.reduce((total, calories) => total+parseInt(calories), 0);
})

const maxCalories = totalElfCalories.reduce((max, calories) => {
  return calories > max ? calories : max;
}, 0);
console.log(JSON.stringify(totalElfCalories, null, 2));
console.log(maxCalories);
