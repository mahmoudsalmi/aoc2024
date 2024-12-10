import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

class Position {
  constructor(
    public x: number,
    public y: number,
  ) {
  }

  equals(pos: Position): boolean {
    return this.x === pos.x && this.y === pos.y;
  }
}

class Data {
  width: number;
  height: number;
  constructor(
    public map: number[][],
  ) {
    this.width = map[0].length;
    this.height = map.length;
  }

  getAllTrailHeads() {
    const tailHeads: [Position, Position][] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const head = new Position(x, y);

        const value = this.get(head);
        if (value === 0) {
          this.getTails(head).forEach((tail) => {
            tailHeads.push([head, tail]);
          });
        }
      }
    }
    return tailHeads;
  }

  get(pos: Position): number {
    return this.map[pos.y][pos.x];
  }

  validPosition(pos: Position): boolean {
    return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
  }

  nextPositions(pos: Position): Position[] {
    return [
      new Position(pos.x + 1, pos.y),
      new Position(pos.x - 1, pos.y),
      new Position(pos.x, pos.y + 1),
      new Position(pos.x, pos.y - 1),
    ].filter((p) => this.validPosition(p));
  }

  getTails(position: Position): Position[] {
    const current = this.get(position);
    if (current === 9) {
      return [position];
    }

    const res: Position[] = [];
    for (const nextPosition of this.nextPositions(position)) {
      const next = this.get(nextPosition);

      if (next === current + 1) {
        const trailheads = this.getTails(nextPosition);
        res.push(...trailheads);
      }
    }
    return res;
  }
}

export class Day10 implements DaySolution<Data, number> {
  day = 10;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    return new Data(
      parseLines(
        parseData(this.day, dataLabel),
        (line) => line.split('').map((c) => parseInt(c)),
      ),
    );
  }

  part1(data: Data): number {
    const trailHeads = data.getAllTrailHeads();

    const uniqTrailHeads: [Position, Position][] = [];
    for (const [head, tail] of trailHeads) {
      if (!uniqTrailHeads.some(([h, t]) => h.equals(head) && t.equals(tail))) {
        uniqTrailHeads.push([head, tail]);
      }
    }

    return uniqTrailHeads.length;
  }

  part2(data: Data): number {
    return data.getAllTrailHeads().length;
  }
}
