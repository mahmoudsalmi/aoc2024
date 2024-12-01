import {DaySolution, parseExempleData, parseInputPart1Data,} from './_tools.ts';

export class Day implements DaySolution<number, number> {
  parseData(dataLabel: "Example" | "Input"): number {
    const rawData = dataLabel === "Example"
      ? parseExempleData(1)
      : parseInputPart1Data(1);
    return rawData.split("\n").length;
  }

  part1 = null;
  part2 = null;
}
