export const lang = "deno-ts";

export function parseExempleData(day: number): string {
  return Deno.readTextFileSync(
    `../data/day${String(day).padStart(2, '0')}-ex.input`
  );
}

export function parseInputPart1Data(day: number): string {
  return Deno.readTextFileSync(
    `../data/day${String(day).padStart(2, '0')}-p1.input`
  );
}

export class SolutionResult<I, O> {
  constructor(
    public dataLabel:
      | "Example"
      | "Input",
    public levelLabel:
      | "Part 1"
      | "Part 2",
    public solution: ((input: I) => O) | null = null,
  ) {
  }

  exec(input: I): string {
    let solution: O | string;
    let execTime: number;

    if (this.solution === null) {
      solution = "(No solution yet)";
      execTime = 0;
    } else {
      const start = performance.now();
      solution = this.solution(input);
      execTime = performance.now() - start;
    }

    return `${this.dataLabel.padEnd(7, " ")} :: ${this.levelLabel} ====> (${
      execTime.toFixed(3).padStart(10, " ")
    }ms) ${String(solution).padStart(20, " ")}`;
  }
}

export function daySolution<I, O>(
  year: number,
  day: number,
  example: I,
  input: I,
  part1: ((input: I) => O) | null = null,
  part2: ((input: I) => O) | null = null,
): string {
  const separator = "-".repeat(60);
  // "----(AOC2023 - Day 02)------------------------[Rust]----
  let res = `----(AOC${year} - Day ${
    String(day).padStart(2, "0")
  })-------------------${("[" + lang + "]").padStart(15, "-")}----\n`;
  res += new SolutionResult("Example", "Part 1", part1).exec(example) + "\n";
  res += new SolutionResult("Example", "Part 2", part2).exec(example) + "\n";
  res += separator + "\n";
  res += new SolutionResult("Input", "Part 1", part1).exec(input) + "\n";
  res += new SolutionResult("Input", "Part 2", part2).exec(input) + "\n";
  res += separator + "\n";
  return res;
}


export function writeResult(year: number, day: number, result: string): void {
  Deno.writeTextFileSync(
    `../result/${year}-day${String(day).padStart(2, "0")}-${lang}.result`,
    result,
  );
}

export interface DaySolution<I, O> {
  parseData: (dataLabel: "Example" | "Input") => I;
  part1: ((input: I) => O) | null;
  part2: ((input: I) => O) | null;
}
