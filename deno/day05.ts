import {DaySolution, parseData} from './_tools.ts';
import {parseLines} from './_helpers.ts';

type Line = number[];

class Data {
  public rules = new Map<number, Map<number, number>>();
  public lines = [] as Line[];

  addRule(s: string) {
    const [a, b] = s.split("|").map((i) => parseInt(i));

    if (!this.rules.has(a)) this.rules.set(a, new Map());
    this.rules.get(a)!.set(b, 1);

    if (!this.rules.has(b)) this.rules.set(b, new Map());
    this.rules.get(b)!.set(a, -1);
  }

  addLine(s: string) {
    this.lines.push(s.split(",").map((i) => parseInt(i)));
  }

  checkRule(a: number, b: number): number {
    return this.rules.get(a)?.get(b) ?? 0;
  }

  isSorted(line: Line): boolean {
    return line.every((v, i) => i === 0 || this.checkRule(line[i - 1], v) >= 0);
  }

  getLineRank(line: Line): number {
    return line[Math.floor(line.length / 2)];
  }
}

export class Day05 implements DaySolution<Data, number> {
  day = 5;

  parseData(dataLabel: "Example" | "Input"): Data {
    let readRules = true;
    return parseLines<string>(
      parseData(this.day, dataLabel),
      (line) => line,
      false,
    )
      .reduce((data, line) => {
        if (line === "") {
          readRules = false;
          return data;
        }
        if (readRules) {
          data.addRule(line);
        } else {
          data.addLine(line);
        }
        return data;
      }, new Data());
  }

  part1(input: Data): number {
    return input.lines
      .filter((line) => input.isSorted(line))
      .map((line) => input.getLineRank(line))
      .reduce((res, r) => res + r, 0);
  }

  part2(input: Data): number {
    return input.lines
      .filter((line) => !input.isSorted(line))
      .map(line => line.sort((a, b) => input.checkRule(a, b)))
      .map((line) => input.getLineRank(line))
      .reduce((res, r) => res + r, 0);
  }
}
