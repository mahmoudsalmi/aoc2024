import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

const BORDER = '_';

class Position {
  constructor(
    public x: number,
    public y: number,
  ) {}

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  add(other: Position): Position {
    return new Position(this.x + other.x, this.y + other.y);
  }

  dirPrincipal(dir: Position): number {
    return dir.x !== 0 ? this.x : this.y;
  }

  dirSecondary(dir: Position): number {
    return dir.x !== 0 ? this.y : this.x;
  }
}

const DIRECTIONS = [
  new Position(-1, 0),
  new Position(0, -1),
  new Position(1, 0),
  new Position(0, 1),
];

class Data {
  public width: number;
  public height: number;

  constructor(public data: string[][]) {
    this.width = data[0].length;
    this.height = data.length;
  }

  get(position: Position): string {
    if (position.x < 0 || position.x >= this.width || position.y < 0 || position.y >= this.height) {
      return BORDER;
    }
    return this.data[position.y][position.x];
  }

  getNeighboursPosition(position: Position): Position[] {
    return DIRECTIONS.map((dir) => position.add(dir));
  }

  getNeighbours(position: Position): string[] {
    return this.getNeighboursPosition(position).map((p) => this.get(p));
  }

  getArea(position: Position): Position[] {
    const value = this.get(position);
    const area = [position];

    let newEl = true;
    while (newEl) {
      const count = area.length;
      const newValues: Position[] = [];

      for (let i = 0; i < area.length; i++) {
        const current = area[i];
        const positionsWithSomeValue = this.getNeighboursPosition(current)
          .filter((n) =>
            this.get(n) === value &&
            area.findIndex((p) => p.equals(n)) === -1 &&
            newValues.findIndex((p) => p.equals(n)) === -1
          );
        newValues.push(...positionsWithSomeValue);
      }
      area.push(...newValues);
      newEl = count !== area.length;
    }

    return area;
  }

  getAreas(): Position[][] {
    const areas = [] as Position[][];
    this.foreach((position) => {
      const processed = areas.some((area) => area.findIndex((p) => p.equals(position)) > -1);
      if (!processed) {
        areas.push(this.getArea(position));
      }
    });
    return areas;
  }

  foreach(callback: (position: Position, value: string) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(new Position(x, y), this.data[y][x]);
      }
    }
  }
}

export class Day12 implements DaySolution<Data, number> {
  day = 12;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    return new Data(
      parseLines(
        parseData(this.day, dataLabel),
        (line) => line.split(''),
      ),
    );
  }

  part1(input: Data): number {
    const areas = input.getAreas();

    let res = 0;
    for (const area of areas) {
      const areaValue = input.get(area[0]);
      let perimeter = 0;
      for (const pos of area) {
        perimeter += input.getNeighbours(pos).filter((n) => n !== areaValue).length;
      }
      res += area.length * perimeter;
    }
    return res;
  }

  part2(input: Data): number {
    const areas = input.getAreas();

    let res = 0;

    for (const area of areas) {
      const areaValue = input.get(area[0]);
      const facades = DIRECTIONS.reduce((res, dir) => res.set(dir, []), new Map<Position, Position[]>());
      let perimeter = 0;

      for (const dir of DIRECTIONS) {
        for (const pos of area) {
          if (input.get(pos.add(dir)) !== areaValue) {
            facades.get(dir)!.push(pos);
          }
        }
      }

      for (const [dir, line] of facades) {
        line.sort((p1, p2) => {
          const principalDiff = p1.dirPrincipal(dir) - p2.dirPrincipal(dir);
          return principalDiff !== 0 ? principalDiff : p1.dirSecondary(dir) - p2.dirSecondary(dir);
        });

        let currentPrincipal = -999;
        let currentSecondary = -999;
        for (let i = 0; i < line.length; i++) {
          const p = line[i];
          if (p.dirPrincipal(dir) !== currentPrincipal) {
            currentPrincipal = p.dirPrincipal(dir);
            currentSecondary = p.dirSecondary(dir);
            perimeter++;
          } else  {
            if (currentSecondary + 1 !== p.dirSecondary(dir)) {
              perimeter++;
            }
            currentSecondary = p.dirSecondary(dir);
          }
        }
      }

      res += area.length * perimeter;
    }

    return res;
  }
}
