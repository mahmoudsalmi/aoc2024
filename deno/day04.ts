import { DaySolution, parseData } from "./_tools.ts";
import { parseLines } from "./_helpers.ts";

type Grid = string[][];
type Vec2 = [number, number];

function getEl(grid: Grid, current: Vec2 | null): string | null {
  if (current === null) return null;
  const [x, y] = current;
  if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
    return null;
  }
  return grid[y][x];
}

const AllDirections: Vec2[] = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
] as Vec2[];

const XMasDirections: Vec2[][] = [
  [[1, 1], [-1, -1]],
  [[1, -1], [-1, 1]],
];

const Word = "XMAS";

function nextVec2(
  grid: Grid,
  current: Vec2,
  direction: Vec2,
): Vec2 | null {
  const [x, y] = current;
  const [dx, dy] = direction;
  const next = [x + dx, y + dy] as Vec2;
  if (
    next[0] < 0 || next[0] >= grid.length || next[1] < 0 ||
    next[1] >= grid[0].length
  ) {
    return null;
  }
  return next;
}

function checkWord(grid: Grid, current: Vec2): number {
  let wordCount = 0;
  for (const direction of AllDirections) {
    let l = 0;
    let next: Vec2 | null = current;
    while (
      next !== null &&
      l < Word.length &&
      Word[l] === getEl(grid, next)
    ) {
      if (l === Word.length - 1) {
        wordCount++;
        break;
      }
      next = nextVec2(grid, next, direction);
      l++;
    }
  }
  return wordCount;
}

function checkXMasDiagram(
  grid: Grid,
  current: Vec2,
): boolean {
  if (getEl(grid, current) !== "A") {
    return false;
  }

  for (const xMasDirection of XMasDirections) {
    const mas: [string | null, string | null] = [
      getEl(grid, nextVec2(grid, current, xMasDirection[0])),
      getEl(grid, nextVec2(grid, current, xMasDirection[1])),
    ];
    mas.sort();
    if (mas[0] !== "M" || mas[1] !== "S") {
      return false;
    }
  }

  return true;
}

export class Day04 implements DaySolution<Grid, number> {
  day = 4;

  parseData(dataLabel: "Example" | "Input"): string[][] {
    return parseLines(parseData(this.day, dataLabel), (s) => s.split(""));
  }

  part1(input: Grid): number {
    let wordCount = 0;
    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < input[y].length; x++) {
        wordCount += checkWord(input, [x, y]);
      }
    }
    return wordCount;
  }

  part2(input: Grid): number {
    let wordCount = 0;
    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < input[y].length; x++) {
        wordCount += checkXMasDiagram(input, [x, y] as Vec2) ? 1 : 0;
      }
    }
    return wordCount;
  }
}
