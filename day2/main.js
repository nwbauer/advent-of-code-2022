const fs = require("fs");

const handScoreLookup = {
  'rock': 1,
  'paper': 2,
  'scissors': 3
};

const winningCombinations = [
  ['rock', 'paper'],
  ['paper', 'scissors'],
  ['scissors', 'rock']
];

const drawCombinations = [
  ['rock', 'rock'],
  ['paper', 'paper'],
  ['scissors', 'scissors']
];

const losingCombinations = [
  ['rock', 'scissors'],
  ['paper', 'rock'],
  ['scissors', 'paper']
];

const outcomeMap = {
  'win': winningCombinations,
  'draw': drawCombinations,
  'lose': losingCombinations
};
 
function getOutcome(round) {
  if(isWin(round)) {
    return 'win';
  } else if (isDraw(round)) {
    return 'draw';
  } else {
    return 'lose';
  }
}

const outcomeScoreLookup = {
  'win': 6,
  'draw': 3,
  'lose': 0
};

function isWin(round) {
  return winningCombinations.some((combo) => {
    return round.every((hand, i) => hand === combo[i])
  });
}

function isDraw(round) {
  return round[0] === round[1];
}

function part1() {
  const input = fs.readFileSync("./input.txt").toString();
  const rounds = input.split('\n');
  
  const decoder = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
    X: 'rock',
    Y: 'paper',
    Z: 'scissors'
  };

  const analyzedRounds = rounds.map((round) => {
    const decoded = [decoder[round[0]], decoder[round[2]]]
    const outcome = getOutcome(decoded);
    const hand = decoded[1];

    const outcomeScore = outcomeScoreLookup[outcome];
    const handScore = handScoreLookup[hand];
    const score = outcomeScore + handScore;
    return {
      intput: round,
      decoded,
      hand,
      outcome,
      outcomeScore,
      handScore,
      score
    };
  });
  // console.log(analyzedRounds);

  return analyzedRounds.reduce((totalScore, round) => {
    return totalScore + round.score;
  },0);
  
}

function part2() {
  const input = fs.readFileSync("./input.txt").toString();
  const rounds = input.split('\n');
  
  const decoder = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
    X: 'lose',
    Y: 'draw',
    Z: 'win'
  };

  const analyzedRounds = rounds.map((round) => {
    const decoded = [decoder[round[0]], decoder[round[2]]]
    const outcome = decoded[1];
    const opponentsHand = decoded[0];
    const hand = outcomeMap[outcome].find((combo) => combo[0] === opponentsHand)[1];

    const outcomeScore = outcomeScoreLookup[outcome];
    const handScore = handScoreLookup[hand];
    const score = outcomeScore + handScore;
    return {
      intput: round,
      decoded,
      hand,
      outcome,
      outcomeScore,
      handScore,
      score
    };
  });
  // console.log(analyzedRounds);

  return analyzedRounds.reduce((totalScore, round) => {
    return totalScore + round.score;
  },0);
  
}

console.log('[part1] strategy total score:', part1());
console.log('[part2] strategy total score:', part2());
