import {
  DaySolution,
  parseExempleData,
  parseInputPart1Data,
} from "./_tools.ts";

export class Day implements DaySolution<[number[], number[]], number> {
  parseData(dataLabel: "Example" | "Input"): [number[], number[]] {
    const rawData = dataLabel === "Example"
      ? parseExempleData(1)
      : parseInputPart1Data(1);

    const result: [number[], number[]] = [[], []];

    const lines = rawData.split("\n").filter((line) => line.length > 0);
    for (const line of lines) {
      const [n1, n2] = line.split(/\s+/);
      result[0].push(parseInt(n1.trim(), 10));
      result[1].push(parseInt(n2.trim(), 10));
    }

    return result;
  }

  part1 = (input: [number[], number[]]) =>  {
    const left = [...input[0]].sort();
    const right = [...input[1]].sort();
    let res = 0;
    for (let i = 0; i < left.length; i++) {
      res += Math.abs(left[i] - right[i]);
    }
    return res;
  }

  part2 = (input: [number[], number[]]) => {
    const scores = new Map<number, number>();

    input[1].forEach(n => {
      if (!scores.has(n)) {
        scores.set(n, 0);
      }
      scores.set(n , scores.get(n)! + 1);
    });

    return input[0].reduce((res, n) => {
      return res + (scores.has(n) ? scores.get(n)! : 0) * n;
    }, 0);
  };
}
