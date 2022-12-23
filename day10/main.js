const fs = require("fs");

const commandLookup = {
  noop: { cycleDuration: 1, updateState: (state) => state },
  addx: {
    cycleDuration: 3,
    updateState(state, commandArgs) {
      const x = state.x + parseInt(commandArgs[1]);
      return {
        x,
        spritePositions: [x - 1, x, x + 1],
      };
    },
  },
};

function getPixel({spritePositions}, crtIndex) {
  return spritePositions.includes(crtIndex) ? '#' : '.';
}

function updateCrt(crt, state, cycleIndex) {
  const crtRow = crt.rows[crt.rows.length - 1];
  const crtIndex = crtRow ? crtRow.length : 1;
  
  if (cycleIndex % 40 === 0) {
    const pixel = getPixel(state, 0);
    crt.rows.push(pixel);
  } else {
    const pixel = getPixel(state, crtIndex);
    crt.rows[crt.rows.length - 1] = `${crtRow}${pixel}`;
  }
  return {
    index: crtIndex,
    rows: [...crt.rows],
  };
}

function executeCommand({ cycleDuration, updateState }, commandArgs, cycles) {
  const commandStartCycle =
    cycles.length === 0 ? initialState : cycles[cycles.length - 1];

  let state = commandStartCycle.state;
  let crt = commandStartCycle.crt;
  
  // use the current cycle's executing slot
  if (!commandStartCycle.executing.length) {
    commandStartCycle.executing = [commandArgs];
  } else {
    state = commandStartCycle.state
    crt = updateCrt(crt, state, cycles.length);
    cycles.push({
      state,
      crt,
      executing: [commandArgs],
    });
  }

  // take up execution cycleDuration
  for (let i = 0; i < cycleDuration - 2; i++) {
    state = commandStartCycle.state
    crt = updateCrt(crt, state, cycles.length);
    cycles.push({
      state,
      crt,
      executing: [commandArgs],
    });
  }

  // update the state, leaving executing slot empty
  state  = updateState(commandStartCycle.state, commandArgs);
  crt = updateCrt(crt, state, cycles.length);
  cycles.push({
    state,
    crt,
    executing: [],
  });
}

function runCommands(commands) {
  const initialCrt = {
    rows: ['#'],
    index: undefined
  };
  const initialState = {
    x: 1,
    spritePositions: [1,2,3]
  }
  const initialCycle = { 
    state: initialState,
    crt: initialCrt,
    executing: []
  };
  const cycles = [initialCycle];

  commands.forEach((commandArgs) => {
    const command = commandLookup[commandArgs[0]];
    executeCommand(command, commandArgs, cycles);
  });
  return cycles;
}

function part1() {
  const input = fs.readFileSync("./input.txt").toString();
  const commands = input.split("\n").map((row) => row.split(" "));

  const cycles = runCommands(commands)

  console.log(JSON.stringify(cycles, null, 2));
  const cycleAnalysis = [20, 60, 100, 140, 180, 220].map((cycle) => {
    const x = cycles[cycle - 1].state.x;
    return {
      cycle,
      strength: cycle * x,
    };
  });
  console.log(cycleAnalysis);
  return cycleAnalysis.reduce((sum, analysis) => sum + analysis.strength, 0);
}

console.log("[part1]", part1());
