import { type DaySolution, parseExempleData, parseInputPart1Data } from './_tools.ts';
import { parseNumbersByLines } from './_helpers.ts';

function isSafe(report: number[]): boolean {
  const increase = report[1] - report[0] > 0;
  return report
    .slice(0, -1)
    .every((_, i) => {
      const diff = report[i + 1] - report[i];
      return Math.abs(diff) >= 1 &&
        Math.abs(diff) <= 3 &&
        increase === diff >= 0;
    });
}

export class Day02 implements DaySolution<number[][], number> {
  day = 2;

  parseData(dataLabel: 'Example' | 'Input'): number[][] {
    const rawData = dataLabel === 'Example' ? parseExempleData(this.day) : parseInputPart1Data(this.day);

    return parseNumbersByLines(rawData);
  }

  part1(reports: number[][]): number {
    return reports.filter(isSafe).length;
  }

  part2(reports: number[][]): number {
    return reports
      .map((report) => report.map((_, i) => report.filter((_, j) => j !== i)))
      .filter((subReports) => subReports.some(isSafe))
      .length;
  }
}
