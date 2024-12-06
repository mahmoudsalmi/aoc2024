import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

function executeOp(op: string): number {
  return [...op.matchAll(/\d+/g)]
    .map((s) => parseInt(s.toString()))
    .reduce((acc, n) => acc * n, 1);
}

export class Day03 implements DaySolution<string, number> {
  day = 3;

  parseData(dataLabel: 'Example' | 'Input') {
    return parseLines(
      parseData(this.day, dataLabel),
      (s) => s,
    ).join(' ');
  }

  part1(input: string): number {
    return [...input.matchAll(/mul\(\d{1,3},\d{1,3}\)/g)]
      .map((op) => executeOp(op[0]))
      .reduce((acc, n) => acc + n, 0);
  }

  part2(input: string): number {
    let activate = true;
    return [...input.matchAll(/(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g)]
      .map((op) => op[0])
      .filter((op): string | null => {
        let res: string | null = null;
        switch (op) {
          case 'do()':
            activate = true;
            break;
          case "don't()":
            activate = false;
            break;
          default: {
            if (activate) res = op;
          }
        }
        return res;
      })
      .filter((op) => op !== null)
      .map((op) => executeOp(op))
      .reduce((acc, n) => acc + n, 0);
  }
}
