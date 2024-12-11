import { DaySolution, parseData } from './_tools.ts';
import { parseNumbersByLines } from './_helpers.ts';

export type Data = number[];

const cache = new Map<string, number>();

function blinkStone(stone: number, step: number): number {
  if (step === 0) {
    return 1;
  }

  if (cache.has(`${stone}-${step}`)) {
    return cache.get(`${stone}-${step}`)!;
  }

  if (stone === 0) {
    const res =  blinkStone(1, step - 1);
    cache.set(`${stone}-${step}`, res);
    return res;
  }

  const stoneStr = stone.toString();
  if (stoneStr.length % 2 === 0) {
    const res = blinkStone(parseInt(stoneStr.slice(0, stoneStr.length / 2)), step - 1) +
      blinkStone(parseInt(stoneStr.slice(stoneStr.length / 2)), step - 1);
    cache.set(`${stone}-${step}`, res);
    return res;
  }

  const res = blinkStone(stone*2024, step - 1);
  cache.set(`${stone}-${step}`, res);
  return res;
}

export class Day11 implements DaySolution<Data, number> {
  day = 11;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    return parseNumbersByLines(
      parseData(this.day, dataLabel),
    ).flat();
  }


  part1(input: Data): number {
    return input
      .map((stone) => blinkStone(stone, 25))
      .reduce((acc, cur) => acc + cur, 0);
  }

  part2(input: Data): number {
    return input
      .map((stone) => blinkStone(stone, 75))
      .reduce((acc, cur) => acc + cur, 0);
  }
}
