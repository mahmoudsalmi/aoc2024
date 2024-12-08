import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

class Position {
  constructor(
    public x: number,
    public y: number,
  ) {}

  toString() {
    return `${this.x.toString().padStart(2, ' ')},${this.y.toString().padStart(2, ' ')}`;
  }
}

class Data {
  all = new Set<Position>();
  indexed = new Map<string, Set<Position>>();

  width = -1;
  height = -1;

  constructor(
    grid = [] as string[][],
  ) {
    this.width = grid[0].length;
    this.height = grid.length;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        const value = grid[y][x];
        if (value !== '.') {
          this.add(value, new Position(x, y));
        }
      }
    }
  }

  add(value: string, position: Position) {
    this.all.add(position);
    if (!this.indexed.has(value)) {
      this.indexed.set(value, new Set());
    }
    this.indexed.get(value)!.add(position);
  }

  isEmpty({ x, y }: Position): boolean {
    return !this.all.has(new Position(x, y));
  }

  inGrid({ x, y }: Position): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  validPosition({ x, y }: Position): boolean {
    return this.inGrid({ x, y }) && this.isEmpty(new Position(x, y));
  }

  calculateAntinodesPart1(p1: Position, p2: Position): Position[] {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    if (dx === 0 || dy === 0) {
      return [];
    }

    const antinode1 = new Position(p2.x + dx, p2.y + dy);
    const antinode2 = new Position(p1.x - dx, p1.y - dy);
    return [antinode1, antinode2].filter((p) => this.validPosition(p));
  }

  calculateAntinodesPart2(p1: Position, p2: Position): Position[] {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    if (dx === 0 || dy === 0) {
      return [];
    }

    const res = [] as Position[];

    let antinode1 = p2;
    while (this.inGrid(antinode1)) {
      res.push(antinode1);
      antinode1 = new Position(antinode1.x + dx, antinode1.y + dy);
    }

    let antinode2 = p1;
    while (this.inGrid(antinode2)) {
      res.push(antinode2);
      antinode2 = new Position(antinode2.x - dx, antinode2.y - dy);
    }

    return res;
  }
}

function solve(data: Data, calculator: (p1: Position, p2: Position) => Position[]): number {
  return [...data.indexed.entries()]
    .map(([, antennas]) => {
      let res = [] as Position[];
      for (const p1 of antennas) {
        for (const p2 of antennas) {
          res = [...res, ...calculator(p1, p2)];
        }
      }
      return res;
    })
    .flat()
    .reduce((antinodes, antinode) => {
      antinodes.add(antinode.toString());
      return antinodes;
    }, new Set<string>())
    .size;
}

export class Day08 implements DaySolution<Data, number> {
  day = 8;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    const grid = parseLines<string[]>(parseData(this.day, dataLabel), (line) => {
      return line.split('');
    });
    return new Data(grid);
  }

  part1(data: Data): number {
    return solve(data, (p1, p2) => data.calculateAntinodesPart1(p1, p2));
  }

  part2(data: Data): number {
    return solve(data, (p1, p2) => data.calculateAntinodesPart2(p1, p2));
  }
}
