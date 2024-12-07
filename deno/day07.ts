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

function generateCombinaisons(size: number, baseOps: Op[], prefix: Op[] = []): Op[][] {
  if (size === 1) return baseOps.map((op) => [...prefix, op]);
  return baseOps.flatMap((op) => generateCombinaisons(size - 1, baseOps, [...prefix, op]));
}

function checkOps(data: Data, baseOps: Op[]): number {
  return data.reduce((sum, { target, numbers }) => {
    for (const ops of generateCombinaisons(numbers.length - 1, baseOps)) {
      let res = numbers[0];
      for (let i = 1; i < numbers.length; i++) {
        switch (ops[i - 1]) {
          case Op.ADD:
            res += numbers[i];
            break;
          case Op.MUL:
            res *= numbers[i];
            break;
          case Op.CONCAT:
            res = parseInt(res.toString() + numbers[i].toString());
            break;
        }
      }
      if (res === target) {
        return sum + target;
      }
    }
    return sum;
  }, 0);
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
    return checkOps(data, OpsP1);
  }

  part2(data: Data): number {
    return checkOps(data, OpsP2);
  }
}
