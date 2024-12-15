import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

type V2 = [number, number];

class Robot {
  constructor(
    public start: V2,
    public velocity: V2,
    public maxX = 101,
    public maxY = 103,
    public current: V2 = start,
  ) {}

  reset(): void {
    this.current = this.start;
  }

  nextSecond(): void {
    this.current = [
      Robot.adjustPosition(this.current[0] + this.velocity[0], this.maxX),
      Robot.adjustPosition(this.current[1] + this.velocity[1], this.maxY),
    ];
  }

  static adjustPosition(n: number, max: number): number {
    const res = n % max;
    return res < 0 ? res + max : res;
  }
}

type Data = Robot[];

// draw the grid with the robots
function drawGrid(currentData: Map<string, number>, width: number, height: number): string {
  let res = '';

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      line += currentData.has(`${x},${y}`) ? '#' : '.';
    }
    res += line + '\n';
  }

  return res;
}

// index the robots by their position
function indexRobots(input: Data): Map<string, number> {
  return input
    .map((robot) => `${robot.current[0]},${robot.current[1]}`)
    .reduce((res, current) => {
      if (!res.has(current)) {
        res.set(current, 0);
      }
      res.set(current, res.get(current)! + 1);
      return res;
    }, new Map<string, number>());
}

export class Day14 implements DaySolution<Data, number> {
  day = 14;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    return parseLines(parseData(this.day, dataLabel), (line) => {
      const [start, velocity] = line
        .split(' ')
        .map((part) => part.split('=').at(-1)!.split(',').map(Number));

      return new Robot(
        [start[0], start[1]],
        [velocity[0], velocity[1]],
        dataLabel === 'Example' ? 7 : 101,
        dataLabel === 'Example' ? 11 : 103,
      );
    });
  }

  part1(input: Data): number {
    // reset initial position
    input.forEach((robot) => robot.reset());

    // move robots 100 seconds
    for (let i = 0; i < 100; i++) {
      input.forEach((robot) => robot.nextSecond());
    }

    // count how many robots are in each quadrant
    const res = [0, 0, 0, 0];
    const halfX = Math.floor(input[0].maxX / 2);
    const halfY = Math.floor(input[0].maxY / 2);
    input.forEach((robot) => {
      const [x, y] = robot.current;
      if (x < halfX && y < halfY) res[0]++;
      else if (x > halfX && y < halfY) res[1]++;
      else if (x < halfX && y > halfY) res[2]++;
      else if (x > halfX && y > halfY) res[3]++;
    });

    // return the product of the number of robots in each quadrant
    return res.reduce((acc, val) => acc * val, 1);
  }

  part2(input: Data): number {
    // reset initial position
    input.forEach((robot) => robot.current = robot.start);

    // assume that the Easter egg that not appears until each robot has a unique position
    for (let i = 1;; i++) {
      input.forEach((robot) => robot.nextSecond());
      if (!indexRobots(input).values().find((v) => v > 1)) return i;
    }
  }

  specialContent(input: Data): string {
    return drawGrid(indexRobots(input), input[0].maxX, input[0].maxY);
  }
}
