const fs = require("fs");

function evaluateExpression(variables, expressionString) {
  if (expressionString.includes("*")) {
    return expressionString.split(" * ").reduce((result, item) => {
      return result * evaluateExpression(variables, item);
    }, 1);
  } else if (expressionString.includes("+")) {
    return expressionString.split(" + ").reduce((result, item) => {
      return result + evaluateExpression(variables, item);
    }, 0);
  } else {
    return expressionString in variables
      ? variables[expressionString]
      : parseInt(expressionString);
  }
}

function makeMonkey(monkeyString) {
  const lines = monkeyString.split("\n");
  const id = lines[0].split('Monkey ')[1].replace(":","");
  const items = lines[1]
    .split(":")[1]
    .split(", ")
    .map((item) => parseInt(item));
  const operation = lines[2].split(":")[1];
  const testString = lines[3].split(": ")[1];

  const trueMonkey = lines[4].split("If true: throw to monkey ")[1];
  const falseMonkey = lines[5].split("If false: throw to monkey ")[1];

  let throwTo;

  if (testString.startsWith("divisible by")) {
    const divisibleBy = parseInt(testString.split("divisible by")[1]);
    throwTo = (item) => item % divisibleBy === 0 ? trueMonkey : falseMonkey;
  }

  const opeationExpression = operation.split(" = ")[1];

  return {
    id,
    items,
    operation,
    inspect(item) {
      return evaluateExpression({ old: item }, opeationExpression)
    },
    inspectionCount: 0,
    testString,
    throwTo,
    trueMonkey,
    falseMonkey,
  };
}

function takeTurn(monkey, worryLevel, monkeys) {
  while(monkey.items.length > 0) {
    monkey.inspectionCount += 1;
    const item = monkey.items.shift();
    console.log(`  inspecting item ${item}`)
    const updatedItem = Math.floor(monkey.inspect(item) / worryLevel);
    const receiverMonkeyIndex = monkey.throwTo(updatedItem);
    const receiverMonkey = monkeys.find(monkey => monkey.id === receiverMonkeyIndex);
    if (!receiverMonkey) {
      throw new Error(`no receiverMonkey for id="${receiverMonkeyIndex}"`)
    }
    console.log(`  throwing item ${updatedItem} to ${receiverMonkeyIndex}`)
    receiverMonkey.items.push(updatedItem);
  }
}
function part1({worryLevel, totalRounds}) {
  const input = fs.readFileSync("./input.txt").toString();
  const monkeyStrings = input.split("\n\n");
  const monkeys = monkeyStrings.map(makeMonkey);

  for(let round = 0; round < totalRounds; round++) {
    monkeys.forEach(monkey => {
      console.log(`round ${round}, monkey ${monkey.id}`)
      takeTurn(monkey, worryLevel, monkeys);
    });
  }

  monkeys.sort((a,b) => b.inspectionCount - a.inspectionCount)
  console.log(monkeys);
  return monkeys[0].inspectionCount * monkeys[1].inspectionCount;
}

console.log("part 1", part1({worryLevel: 3, totalRounds: 20}));
