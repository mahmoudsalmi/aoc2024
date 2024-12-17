import { DaySolution, parseData } from './_tools.ts';

type V2 = [number, number];

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

class Data {
  public current: V2 = [0, 0];
  public boxes = new Map<string, V2>();

  constructor(
    public width: number,
    public height: number,
    public instructions: Direction[],
    public start: V2 = [0, 0],
    public initBoxes: V2[] = [],
    public walls = new Set<string>(),
  ) {
    this.reset();
  }

  setStart(position: V2) {
    this.start = position;
    this.current = position;
  }

  reset() {
    this.current = this.start;
    this.boxes = new Map();
    this.initBoxes.forEach((b) => this.boxes.set(`${b[0]},${b[1]}`, b));
  }

  inGrid(position: V2): boolean {
    const [x, y] = position;
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  isWall(position: V2): boolean {
    return this.walls.has(`${position[0]},${position[1]}`);
  }

  isBox(position: V2): boolean {
    return this.boxes.has(`${position[0]},${position[1]}`);
  }

  isEmpty(position: V2): boolean {
    return !this.isWall(position) && !this.isBox(position);
  }

  nextPosition(position: V2, dir: Direction): V2 {
    switch (dir) {
      case Direction.Up:
        return [position[0], position[1] - 1];
      case Direction.Right:
        return [position[0] + 1, position[1]];
      case Direction.Down:
        return [position[0], position[1] + 1];
      case Direction.Left:
        return [position[0] - 1, position[1]];
    }
  }

  nextEmptyCell(position: V2, dir: Direction): V2 | null {
    let nextPosition = this.nextPosition(position, dir);
    while (true) {
      if (this.isWall(nextPosition)) {
        return null;
      }
      if (!this.inGrid(nextPosition)) {
        return null;
      }
      if (!this.isBox(nextPosition)) {
        return nextPosition;
      }
      nextPosition = this.nextPosition(nextPosition, dir);
    }
  }

  applyInstruction(dir: Direction): boolean {
    const nextPosition = this.nextPosition(this.current, dir);
    if (this.isEmpty(nextPosition)) {
      this.current = nextPosition;
      return true;
    }

    if (this.isWall(nextPosition)) {
      return false;
    }

    const nextBoxPosition = this.nextEmptyCell(nextPosition, dir);
    if (nextBoxPosition === null) {
      return false;
    }

    this.current = nextPosition;
    this.boxes.delete(`${nextPosition[0]},${nextPosition[1]}`);
    this.boxes.set(`${nextBoxPosition[0]},${nextBoxPosition[1]}`, nextBoxPosition);
    return true;
  }

  draw(): string {
    let res = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.current[0] === x && this.current[1] === y) {
          res += '@';
        } else if (this.isBox([x, y])) {
          res += 'O';
        } else if (this.isWall([x, y])) {
          res += '#';
        } else {
          res += '.';
        }
      }
      res += '\n';
    }

    return res;
  }
}

export class Day15 implements DaySolution<Data, number> {
  day = 15;
  parseData(dataLabel: 'Example' | 'Input'): Data {
    const rawData = parseData(this.day, dataLabel).split('\n\n');

    const instructions = rawData.at(1)!
      .split('')
      .map((c) => {
        switch (c) {
          case '^':
            return Direction.Up;
          case '>':
            return Direction.Right;
          case 'v':
            return Direction.Down;
          case '<':
            return Direction.Left;
          default:
            return null;
        }
      })
      .filter((d) => d !== null) as Direction[];

    const gridLines = rawData.at(0)!.split('\n');

    const data = new Data(gridLines[0].length, gridLines.length, instructions);

    for (let y = 0; y < data.height; y++) {
      const line = gridLines[y];
      for (let x = 0; x < data.width; x++) {
        const char = line.charAt(x);
        if (char === 'O') {
          data.initBoxes.push([x, y]);
        }
        if (char === '#') {
          data.walls.add(`${x},${y}`);
        }
        if (char === '@') {
          data.setStart([x, y]);
        }
      }
    }
    return data;
  }

  part1(data: Data): number {
    data.reset();
    data.instructions.forEach((dir) => data.applyInstruction(dir));
    return data.boxes.values().reduce((acc, [x, y]) => acc + x + y * 100, 0);
  }

  part2 = null;
}
