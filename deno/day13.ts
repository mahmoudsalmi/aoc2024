import { DaySolution, parseData } from './_tools.ts';
import { parseLines } from './_helpers.ts';

type V2 = [number, number];

type Machine = {
  a: V2;
  b: V2;
  prize: V2;
};

class Data {
  constructor(
    public machines: Machine[] = [],
  ) {}

  addCase(a: V2, b: V2, prize: V2) {
    this.machines.push({a, b, prize});
  }
}

function extractXY(s: string): V2 {
  const [x, y] = [...s.matchAll(/(\d+)/g)].map((m) => parseInt(m[0], 10));
  return [x, y] as V2;
}

function cramerRule({a, b, prize}: Machine): V2 | null{
  //    a[0] * aTokens + b[0] * bTokens = prize[0]
  //    a[1] * bTokens + b[1] * bTokens = prize[1]
  const det = a[0] * b[1] - a[1] * b[0];
  if (det === 0) return null;

  const detX = prize[0] * b[1] - prize[1] * b[0];
  const detY = a[0] * prize[1] - a[1] * prize[0];

  const aTokens = detX / det;
  const bTokens = detY / det;

  if (!Number.isInteger(aTokens) || !Number.isInteger(bTokens)) return null;

  return [aTokens, bTokens] as V2;
}

export class Day13 implements DaySolution<Data, number> {
  day = 13;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    let dataBloc: string[] = [];
    return parseLines(parseData(this.day, dataLabel), (l) => l)
      .reduce(
        (data, line) => {
          dataBloc.push(line);
          if (dataBloc.length == 3) {
            data.addCase(extractXY(dataBloc[0]), extractXY(dataBloc[1]), extractXY(dataBloc[2]));
            dataBloc = [];
          }
          return data;
        },
        new Data(),
      );
  }

  part1(input: Data): number {
    return input.machines
      .map((m) => cramerRule(m))
      .filter((s) => s != null)
      .reduce((res, [aTokens, bTokens]) => res + aTokens * 3 + bTokens, 0);
  }

  part2(input: Data): number {
    return input.machines
      .map(m => ({
        a: m.a,
        b: m.b,
        prize: [
          m.prize[0] + 10000000000000,
          m.prize[1] + 10000000000000
        ]
      }) as Machine)
      .map((m: Machine) => cramerRule(m))
      .filter((s) => s != null)
      .reduce((res, [aTokens, bTokens]) => res + aTokens * 3 + bTokens, 0);
  };
}
