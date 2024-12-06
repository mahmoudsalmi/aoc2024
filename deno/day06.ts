import { DaySolution, parseData } from "./_tools.ts";
import { parseLines } from "./_helpers.ts";

type Grid = boolean[][];
type Position = { x: number; y: number };
const Directions = {
  U: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
};
type Direction = keyof typeof Directions;

class Data {
  public grid = [] as Grid;
  public start: Position | null = null;

  public current: Position | null = null;
  public direction: Direction = "U";

  public addedObstacle: Position | null = null;
  public visited: Set<Direction>[][] = [];

  addLine(s: string) {
    this.grid.push(
      s.split("").map((c, x) => {
        if (c === "^") this.start = { x, y: this.grid.length };
        return c === "#";
      }),
    );
  }

  reset() {
    this.direction = "U";
    this.current = this.start;
    this.visited = this.grid.map((row) => row.map(() => new Set<Direction>()));
    this.visited[this.start!.y][this.start!.x].add(this.direction);
  }

  width() {
    return this.grid[0].length;
  }

  height() {
    return this.grid.length;
  }

  isObstacle({ x, y }: Position): boolean {
    return this.grid[y][x] ||
      (x === this.addedObstacle?.x && y === this.addedObstacle?.y);
  }

  isStart({ x, y }: Position): boolean {
    return x === this.start!.x && y === this.start!.y;
  }

  next(): boolean | "LOOP" {
    let { x, y } = this.current!;
    x += Directions[this.direction].x;
    y += Directions[this.direction].y;

    if (x < 0 || x >= this.width() || y < 0 || y >= this.height()) {
      return false;
    }

    if (this.visited[y][x].has(this.direction)) {
      return "LOOP";
    }

    if (this.isObstacle({ x, y })) {
      this.direction = this.turnRight();
    } else {
      this.current = { x, y };
    }
    this.visited[this.current!.y][this.current!.x].add(this.direction);

    return true;
  }

  turnRight() {
    const toRight: Record<Direction, Direction> = {
      U: "R",
      R: "D",
      D: "L",
      L: "U",
    };
    return toRight[this.direction];
  }

  walkInto(): number {
    this.reset();
    let next: boolean | "LOOP" = true;
    while (next === true) {
      next = this.next();
      if (next === "LOOP") {
        return -1;
      }
    }
    return this.visited.flat().filter((s) => s.size > 0).length;
  }
}

export class Day06 implements DaySolution<Data, number> {
  day = 6;

  parseData(dataLabel: "Example" | "Input"): Data {
    const data = new Data();
    parseLines(parseData(this.day, dataLabel), (line) => data.addLine(line));
    return data;
  }

  part1(data: Data): number {
    return data.walkInto();
  }

  part2(data: Data): number {
    let loops = 0;
    for (let y = 0; y < data.height(); y++) {
      for (let x = 0; x < data.width(); x++) {
        data.addedObstacle = null;
        if (!data.isObstacle({ x, y }) && !data.isStart({ x, y })) {
          data.addedObstacle = { x, y };
          const result = data.walkInto();
          if (result === -1) {
            loops++;
          }
        }
      }
    }
    return loops;
  }
}
