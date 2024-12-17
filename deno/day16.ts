import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

type Position = [number, number];

enum Cell {
  _, // Empty
  W, // Wall
  S, // Start
  E, // End
}

function charToCell(char: string): Cell {
  switch (char) {
    case '.':
      return Cell._;
    case '#':
      return Cell.W;
    case 'S':
      return Cell.S;
    case 'E':
      return Cell.E;
  }
  throw new Error(`Invalid cell char: ${char}`);
}

enum Dir {
  Up,
  Right,
  Down,
  Left,
}

const dirPositions: Record<Dir, Position> = {
  [Dir.Up]: [0, -1],
  [Dir.Down]: [0, 1],
  [Dir.Right]: [1, 0],
  [Dir.Left]: [-1, 0],
};

function allDirections(elements: Dir[] = [Dir.Up, Dir.Right, Dir.Down, Dir.Left]): Dir[][] {
  if (elements.length === 1) {
    return [elements];
  }

  const res = [];
  for (let i = 0; i < elements.length; i++) {
    const rest = elements.slice(0, i).concat(elements.slice(i + 1));
    for (const restPerm of allDirections(rest)) {
      res.push([elements[i]].concat(restPerm));
    }
  }
  return res;
}

const Directions: Dir[][] = allDirections();

const dirCost = (newDir: Dir, currentDir: Dir): number => {
  return newDir === currentDir ? 1 : 1001;
};

type CostTiles = { cost: number; tiles: Set<string> };

class Grid {
  public width: number;
  public height: number;
  public start: Position = [0, 0];
  public end: Position = [0, 0];
  public directions: Dir[] = Directions[0];

  constructor(
    public grid: Cell[][],
  ) {
    this.grid = grid;
    this.width = grid[0].length;
    this.height = grid.length;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        switch (this.getCell([x, y])) {
          case Cell.S:
            this.start = [x, y];
            break;
          case Cell.E:
            this.end = [x, y];
            break;
        }
      }
    }
  }

  getCell([x, y]: Position): Cell | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }

  getNeighbors([x, y]: Position, currentDir: Dir): [Position, number, Dir][] {
    if (this.getCell([x, y]) === Cell.E) {
      return [];
    }

    return this.directions
      .map((dir) =>
        [
          [x + dirPositions[dir][0], y + dirPositions[dir][1]],
          dirCost(dir, currentDir),
          dir,
        ] as [Position, number, Dir]
      )
      .filter(([pos]) => this.getCell(pos) !== Cell.W);
  }

  findShortestPath(): CostTiles {
    const costs: Map<string, CostTiles> = new Map<string, CostTiles>();
    costs.set(this.start.toString(), { cost: 1, tiles: new Set<string>(this.start.toString()) });

    const queue: [Position, number, Dir, Set<string>][] = [[this.start, 1, Dir.Right, new Set<string>([this.start.toString()])]];

    while (queue.length) {
      const [currentPosition, currentCost, currentDir, currentTiles] = queue.shift()!;

      for (const [nextPosition, nextDirectCost, nextDir] of this.getNeighbors(currentPosition, currentDir)) {
        const nextKey = nextPosition.toString();
        const nextCost = currentCost + nextDirectCost;

        const savedCost = costs.get(nextKey)?.cost ?? Infinity;
        if (nextCost < savedCost) {
          const tiles = new Set<string>([...currentTiles, nextKey.toString()]);
          queue.push([nextPosition, nextCost, nextDir, tiles]);
          costs.set(nextKey, { cost: currentCost, tiles });
        }
      }
    }

    return costs.get(this.end.toString())!;
  }

  drawPath(tiles: Set<string>): string {
    let res = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pos = [x, y].toString();
        res += tiles.has(pos) ? 'O' : this.grid[y][x] === Cell.W ? '#' : '.';
      }
      res += '\n';
    }
    return res;
  }
}

type Data = Grid;

export class Day16 implements DaySolution<Data, number> {
  day = 16;

  parseData(dataLabel: 'Example' | 'Input'): Grid {
    return new Grid(
      parseLines(parseData(this.day, dataLabel), (line) => line.split('').map(charToCell)),
    );
  }

  part1(data: Data): number {
    return data.findShortestPath().cost;
  }

  part2(data: Data): number {
    const tilesList = Directions
      .map((directions) => {
        data.directions = directions;
        return data.findShortestPath().tiles;
      });

    const res = new Set<string>();
    tilesList.forEach((tiles) => {
      tiles.forEach(tile => res.add(tile));
    });

    return res.size;
  }
}
