import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

type Problem = {
  target: number;
  numbers: number[];
};

type Data = Problem[];

enum Op {
  ADD,
  MUL,
  CONCAT,
}
const OpsP1 = [Op.ADD, Op.MUL];
const OpsP2 = [Op.ADD, Op.MUL, Op.CONCAT];

function applyOp(op: Op, a: number, b: number): number {
  switch (op) {
    case Op.ADD:
      return a + b;
    case Op.MUL:
      return a * b;
    case Op.CONCAT:
      return parseInt(a.toString() + b.toString());
  }
}

function checkRecOps(numbers: number[], target: number, baseOps: Op[], previousRes: number, idx: number): number {
  if (idx === numbers.length) {
    return previousRes;
  }

  for (const op of baseOps) {
    const res = checkRecOps(numbers, target, baseOps, applyOp(op, previousRes, numbers[idx]), idx + 1);
    if (res === target) {
      return res;
    }
  }

  return 0;
}

export class Day07 implements DaySolution<Data, number> {
  day = 7;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    return parseLines(parseData(this.day, dataLabel), (line) => {
      const [targetS, numbersS] = line.split(':').map((s) => s.trim());

      return {
        target: parseInt(targetS),
        numbers: numbersS.split(' ').map((s) => parseInt(s.trim())),
      };
    });
  }

  part1(data: Data): number {
    return data.map(({target, numbers}) => checkRecOps(numbers, target, OpsP1, numbers[0], 1))
      .reduce((sum, res) => sum + res, 0);
  }

  part2(data: Data): number {
    return data.map(({target, numbers}) => checkRecOps(numbers, target, OpsP2, numbers[0], 1))
      .reduce((sum, res) => sum + res, 0);
  }
}
