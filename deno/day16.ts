import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

type Position = [number, number];

enum Cell {
  Empty,
  Wall,
  Start,
  End,
}

function charToCell(char: string): Cell {
  switch (char) {
    case '.':
      return Cell.Empty;
    case '#':
      return Cell.Wall;
    case 'S':
      return Cell.Start;
    case 'E':
      return Cell.End;
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

const directions: Dir[] = [Dir.Right, Dir.Down, Dir.Left, Dir.Up];

const dirCost = (newDir: Dir, currentDir: Dir): number => {
  return newDir === currentDir ? 1 : 1001;
};

type CostTiles = { cost: number; tiles: Set<string> };

class Grid {
  public width: number;
  public height: number;
  public start: Position = [0, 0];
  public end: Position = [0, 0];

  constructor(
    public grid: Cell[][],
  ) {
    this.grid = grid;
    this.width = grid[0].length;
    this.height = grid.length;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        switch (this.getCell([x, y])) {
          case Cell.Start:
            this.start = [x, y];
            break;
          case Cell.End:
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

  getNeighbors([x, y]: Position, currentDir: Dir): { nextPosition: Position; nextDirectCost: number; nextDir: Dir }[] {
    if (this.getCell([x, y]) === Cell.End) {
      return [];
    }

    return directions
      .map((dir) => ({
        nextPosition: [x + dirPositions[dir][0], y + dirPositions[dir][1]] as Position,
        nextDirectCost: dirCost(dir, currentDir),
        nextDir: dir,
      }))
      .filter(({ nextPosition }) => this.getCell(nextPosition) !== Cell.Wall);
  }

  initCosts(): Map<string, CostTiles> {
    return new Map<string, CostTiles>();
  }

  addCost(costs: Map<string, CostTiles>, position: Position, dir: Dir, cost: number, ...tiles: (string | Position)[]): CostTiles {
    const oldValues = costs.get(`${position.toString()}|${dir.toString()}`);

    let newTiles = [...tiles];
    if (oldValues?.cost === cost) {
      newTiles = [...oldValues.tiles, ...tiles];
    }

    costs.set(`${position.toString()}|${dir.toString()}`, { cost, tiles: new Set(newTiles.map((tile) => tile.toString())) });
    return costs.get(`${position.toString()}|${dir.toString()}`)!;
  }

  getCost(costs: Map<string, CostTiles>, position: Position, dir: Dir): CostTiles {
    return costs.get(`${position.toString()}|${dir.toString()}`)!;
  }

  initQueue(): { currentPosition: Position; currentCost: number; currentDir: Dir; currentTiles: Set<string> }[] {
    return [] as { currentPosition: Position; currentCost: number; currentDir: Dir; currentTiles: Set<string> }[];
  }

  pushQueue(
    queue: { currentPosition: Position; currentCost: number; currentDir: Dir; currentTiles: Set<string> }[],
    currentPosition: Position,
    currentCost: number,
    currentDir: Dir,
    currentTiles: (string | Position)[],
  ): void {
    queue.push({ currentPosition, currentCost, currentDir, currentTiles: new Set(currentTiles.map((tile) => tile.toString())) });
  }

  findShortestPath(): CostTiles {
    const costs = this.initCosts();
    const queue = this.initQueue();

    const startDir = Dir.Right;
    const { cost, tiles } = this.addCost(costs, this.start, startDir, 1, this.start);

    this.pushQueue(queue, this.start, cost, startDir, [...tiles]);

    while (queue.length) {
      const { currentPosition, currentCost, currentDir, currentTiles } = queue.shift()!;

      for (const { nextPosition, nextDirectCost, nextDir } of this.getNeighbors(currentPosition, currentDir)) {
        const nextCost = currentCost + nextDirectCost;

        const savedCost = this.getCost(costs, nextPosition, nextDir)?.cost ?? Infinity;
        if (nextCost < savedCost) {
          const { cost, tiles } = this.addCost(costs, nextPosition, nextDir, nextCost, ...[...currentTiles, nextPosition]);
          this.pushQueue(queue, nextPosition, cost, nextDir, [...tiles]);
        }
      }
    }

    return directions
      .map((dir) => this.getCost(costs, this.end, dir))
      .filter((cost) => cost !== undefined)
      .reduce((minCost, cost) => {
        if (cost!.cost < minCost.cost) {
          return cost!;
        }
        return minCost;
      });
  }

  // drawPath(tiles: Set<string>): string {
  //   let res = '';
  //   for (let y = 0; y < this.height; y++) {
  //     for (let x = 0; x < this.width; x++) {
  //       const pos = [x, y].toString();
  //       res += tiles?.has(pos) ? 'O' : this.grid[y][x] === Cell.Wall ? '#' : '.';
  //     }
  //     res += '\n';
  //   }
  //   return res;
  // }
}

type Data = Grid;

export class Day16 implements DaySolution<Data, number> {
  day = 16;

  parseData(dataLabel: 'Example' | 'Input'): Grid {
    return new Grid(
      parseLines(
        parseData(
          this.day,
          dataLabel,
        ),
        (line) => line.split('').map(charToCell),
      ),
    );
  }

  part1(data: Data): number {
    return data.findShortestPath()?.cost ?? -1;
  }

  part2(data: Data): number {
    return data.findShortestPath()?.tiles.size ?? -1;
  }
}
