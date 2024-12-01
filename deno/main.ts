import {daySolution, writeResult} from './_tools.ts';

const year = 2024;
const lastDay = 1;

let day = 1;
while (day <= lastDay) {
  const dayModule = await import(`./day${String(day).padStart(2, "0")}.ts`);
  const dayS = new dayModule.Day();
  const result = daySolution(
    year,
    day,
    dayS.parseData("Example"),
    dayS.parseData("Input"),
    dayS.part1,
    dayS.part2,
  );
  console.log(result);
  writeResult(year, day, result);
  day++;
}
