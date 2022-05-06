const HORIZONTAL = 1,
  VERTICAL = 2;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomInt2(min, max) {
  // include min and max
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function chooseOrientation(width, height) {
  if (width > height) return VERTICAL;
  else if (height > width) return HORIZONTAL;
  else return getRandomInt(2) === 0 ? VERTICAL : HORIZONTAL;
}

export function surroundingWall(grid, wallNodes) {
  for (const row of grid) {
    for (const node of row) {
      if (
        node.row === 0 ||
        node.col === 0 ||
        node.row === grid.length - 1 ||
        node.col === row.length - 1
      ) {
        node.isWall = true;
        wallNodes.push({ row: node.row, col: node.col });
      }
    }
  }
}

export default function divide(
  grid,
  col,
  row,
  width,
  height,
  orientation,
  wallNodes,
  step,
) {
  if (width < 3 || height < 3) return;
  const horizontal = orientation === HORIZONTAL;
  const length = horizontal ? width : height;
  let wc, wr;
  let checkLoop = 0;
  do {
    wc = col + (horizontal ? 0 : getRandomInt2(1, width - 2));
    wr = row + (horizontal ? getRandomInt2(1, height - 2) : 0);
    if (checkLoop > 60) {
      return;
    }
    checkLoop++;
  } while (
    (horizontal
      ? !grid[wr][wc + length].isWall
      : !grid[wr + length][wc].isWall) ||
    (horizontal ? !grid[wr][wc - 1].isWall : !grid[wr - 1][wc].isWall)
  );
  const pc = horizontal ? wc + getRandomInt(width) : wc;
  const pr = horizontal ? wr : wr + getRandomInt(height);
  const dc = horizontal ? 1 : 0;
  const dr = horizontal ? 0 : 1;
  for (let i = 0; i < length; i++) {
    if (
      !(wc === pc && wr === pr) &&
      !grid[wr][wc].isStartNode &&
      !grid[wr][wc].isFinishNode
    ) {
      grid[wr][wc].isWall = true;
      wallNodes.push({ row: wr, col: wc });
    }
    wc += dc;
    wr += dr;
  }
  let nc = col;
  let nr = row;
  let w = horizontal ? width : wc - col;
  let h = horizontal ? wr - row : height;
  divide(grid, nc, nr, w, h, chooseOrientation(w, h), wallNodes, step + 1);

  nc = horizontal ? col : wc + 1;
  nr = horizontal ? wr + 1 : row;
  w = horizontal ? width : col + width - wc - 1;
  h = horizontal ? row + height - wr - 1 : height;
  divide(grid, nc, nr, w, h, chooseOrientation(w, h), wallNodes, step + 1);
}
