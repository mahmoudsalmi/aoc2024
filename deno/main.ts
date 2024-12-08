import { DaySolution, daySolution, writeResult } from './_tools.ts';
import { Day01 } from './day01.ts';
import { Day02 } from './day02.ts';
import { Day03 } from './day03.ts';
import { Day04 } from './day04.ts';
import { Day05 } from './day05.ts';
import { Day06 } from './day06.ts';
import { Day07 } from './day07.ts';
import { Day08 } from './day08.ts';

export const YEAR = 2024;

function getAndStoreResult<I, O>(
  dayS: DaySolution<I, O>,
  startDay: number,
  endDay: number,
) {
  if (dayS.day < startDay || dayS.day > endDay) {
    return;
  }

  const result = daySolution(dayS);
  console.log(result);
  writeResult(YEAR, dayS.day, result);
  startDay++;
}

if (import.meta.main) {
  let startDay = 1;
  let endDay = 25;
  if (Deno.args.length > 0) {
    startDay = parseInt(Deno.args[0], 10);
    endDay = startDay;
  }
  if (Deno.args.length > 1) {
    endDay = parseInt(Deno.args[1], 10);
  }

  getAndStoreResult(new Day01(), startDay, endDay);
  getAndStoreResult(new Day02(), startDay, endDay);
  getAndStoreResult(new Day03(), startDay, endDay);
  getAndStoreResult(new Day04(), startDay, endDay);
  getAndStoreResult(new Day05(), startDay, endDay);
  getAndStoreResult(new Day06(), startDay, endDay);
  getAndStoreResult(new Day07(), startDay, endDay);
  getAndStoreResult(new Day08(), startDay, endDay);
}
