const fs = require("fs");

const directions = ["up", "down", "left", "right"];

/**
 * Gets all tree heights from (and including) a node
 * in one direction.
 */
function getTreeHeights(node, direction, heights = []) {
  if (!node) {
    return heights;
  }
  heights.push(node.height);
  return getTreeHeights(node[direction], direction, heights);
}

function isVisible(treeNode) {
  return directions.some((direction) => {
    const treeHeights = getTreeHeights(treeNode[direction], direction);
    const tallestTree = treeHeights.reduce(
      (max, height) => (height > max ? height : max),
      -1
    );
    if (tallestTree !== -1) {
      return treeNode.height > tallestTree;
    } else {
      return true;
    }
  });
}

function scenicScore(treeNode) {
  return directions
    .map((direction) => {
      const treeHeights = getTreeHeights(treeNode[direction], direction);
      const viewingIndex = treeHeights.findIndex(
        (height) => height >= treeNode.height
      );
      const directionScore =
        viewingIndex === -1 ? treeHeights.length : viewingIndex + 1;
      // console.log(treeNode.height, direction, directionScore)
      return Math.max(directionScore, 1);
    })
    .reduce((total, score) => total * score, 1);
}

function getTreeNodes(treeMatrix) {
  const treeNodes = treeMatrix.map((row, i) => {
    return row.map((height, j) => {
      return {
        height: parseInt(height),
        i,
        j,
      };
    });
  });

  return treeNodes
    .map((row, i) => {
      row.forEach((treeNode, j) => {
        treeNode.up = treeNodes[i - 1] ? treeNodes[i - 1][j] : undefined;
        treeNode.down = treeNodes[i + 1] ? treeNodes[i + 1][j] : undefined;
        treeNode.left = treeNodes[i][j - 1];
        treeNode.right = treeNodes[i][j + 1];
      });
      return row;
    })
    .flat();
}

function part1() {
  const input = fs.readFileSync("./input.txt").toString();
  const treeMatrix = input.split("\n").map((row) => row.split(""));

  const treeNodes = getTreeNodes(treeMatrix);

  // extend tree nodes with visable property
  treeNodes.forEach((treeNode, i) => {
    treeNode.isVisible = isVisible(treeNode);
  });

  return treeNodes.filter((node) => {
    return node.isVisible;
  }).length;
}

function part2() {
  const input = fs.readFileSync("./input.txt").toString();
  const treeMatrix = input.split("\n").map((row) => row.split(""));

  const treeNodes = getTreeNodes(treeMatrix);

  // extend tree nodes with visable property
  treeNodes.forEach((treeNode, i) => {
    treeNode.scenicScore = scenicScore(treeNode);
    // console.log(treeNode.i, treeNode.j, treeNode.scenicScore)
  });

  return treeNodes.reduce((max, node) => {
    return node.scenicScore > max ? node.scenicScore : max;
  }, 0);
}

console.log("part 1", part1());
console.log("part 2", part2());
