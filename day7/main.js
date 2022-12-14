const fs = require("fs");

function createChildIfNeeded(location, child) {
  const existingChild = location.children.find((d) => d.name === child.name);
  if (existingChild) {
    return existingChild;
  } else {
    location.children.push(child);
    return child;
  }
}

function printNode({name, type, size}, depth = 0) {
  const depthMarker =  Array(depth).fill('-').join('');
  console.log(`${depthMarker} ${JSON.stringify({name, type, size})}`);
}

function printTree(root, depth = 0) {
  printNode(root, depth);
  root.children?.forEach(child => printTree(child, depth + 1));
}

function calculateFolderSize(node) {
  return node.children.reduce((sum, child) => {
    if (child.type === 'dir') {
      return sum + calculateFolderSize(child);
    } else {
      return sum + child.size;
    }
  }, 0);
}

function appendFolderSizes(node) {
  if (node.type === 'dir') {
    node.size = calculateFolderSize(node);
    node.children.forEach((node) => appendFolderSizes(node));
  }
}

function findNodes(node, predicate) {
  const res = node.children ? node.children.map((child) => findNodes(child, predicate)).flat() : [];
  if(predicate(node)) {
    res.push(node);
  }
  return res;
}

function buildFileTreeFromTerminalLines(terminalLines) {
  const fileTree = {
    name: 'root',
    parent: undefined,
    children: [],
    type: 'dir'
  };

  let location = undefined;
  let lastCommand = undefined;

  console.log('terminalLines', terminalLines)
  terminalLines.forEach((line) => {
    console.log('parsing line', line)
    const isCommand = line.startsWith('$');
    if (isCommand) {
      if (line.startsWith('$ cd')) {
        lastCommand = 'cd';
        const directoryChangeArg = line.replace("$ cd ", "");
        console.log('directoryChange', directoryChangeArg)
        if (directoryChangeArg === '..') {
          location = location.parent;
        } else if (directoryChangeArg === '/') {
          location = fileTree;
        } else {
          const child = createChildIfNeeded(location, {
            name: directoryChangeArg,
            parent: location,
            children: [],
            type: 'dir'
          });
          location = child;
        }
        console.log('>>> active dir', location.name);
      } else if (line.startsWith('$ ls')) {
        lastCommand = 'ls';
      }
      // console.log('new location', location)
    } else {
      console.log('parsing outcome')
      // we have some output to parse
      if (lastCommand === 'ls') {
        if (line.startsWith('dir')) {
          const dirName = line.replace("dir ", "");
          console.log('adding dir', dirName);
          createChildIfNeeded(location, {
            name: dirName,
            parent: location,
            children: [],
            type: 'dir'
          });
        } else {
          const [fileSize, fileName] = line.split(" ");
          console.log('adding file', fileName);
          createChildIfNeeded(location, {
            name: fileName,
            size: parseInt(fileSize),
            type: 'file'
          });
        }
      }
    }
  });
  return fileTree;
}
function part1() {
  const input = fs.readFileSync("./input.txt").toString();
  const terminalLines = input.split('\n');
  const fileTree = buildFileTreeFromTerminalLines(terminalLines);
  appendFolderSizes(fileTree);
  // printTree(fileTree);

  const nodes = findNodes(fileTree, (node) => node.type === 'dir' && node.size <= 100000)
  nodes.forEach((node) => printNode(node))
  return nodes.reduce((sum, node) => sum + node.size, 0);
}

function part2() {
  const input = fs.readFileSync("./input.txt").toString();
  const terminalLines = input.split('\n');
  const fileTree = buildFileTreeFromTerminalLines(terminalLines);
  appendFolderSizes(fileTree);
  const fileSystemSize = 70000000;
  const minSpaceRequired = 30000000;
  const usedSpace = fileSystemSize - fileTree.size;
  const sizeToDelete = minSpaceRequired - usedSpace;
  console.log('sizeToDelete', sizeToDelete);

  const nodes = findNodes(fileTree, (node) => node.type === 'dir' && node.size >= sizeToDelete)
  console.log('directories that can be deleted:');
  nodes.forEach((node) => printNode(node))
  return nodes.reduce((minNode, node) => {
    return node.size < minNode.size ? node : minNode;
  }, nodes[0]).size;
}

console.log('part 1', part1())
console.log('part 2', part2())