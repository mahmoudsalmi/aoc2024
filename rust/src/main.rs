use std::env;
use std::fmt::Display;
use std::ops::Range;
use std::time::Instant;

mod tools;
mod day01;
mod day02;

pub trait DaySolution<I, O> {
    fn day(&self) -> u16;
    fn parse_input(&self, example: bool) -> I;
    fn part1(&self, input: &I) -> O;
    fn part2(&self, input: &I) -> O;
}

const YEAR: &str = "2024";
const LANG: &str = "[rust]";

fn day_solution<I, O: Display>(solution: Box<dyn DaySolution<I, O>>) -> String {
    let mut res = String::new();
    res.push_str(&format!(
        "----(AOC{} - Day {:02})-------------------{:->15}----\n",
        YEAR, solution.day(), LANG
    ));
    let ex_data = solution.parse_input(true);
    let p1_data = solution.parse_input(false);
    res.push_str(&execute_solution(&ex_data, &solution, true, true));
    res.push_str(&execute_solution(&ex_data, &solution, false, true));
    res.push_str(&"------------------------------------------------------------\n");
    res.push_str(&execute_solution(&p1_data, &solution, true, false));
    res.push_str(&execute_solution(&p1_data, &solution, false, false));
    res.push_str(&"------------------------------------------------------------\n");

    res
}

fn execute_solution<I, O: Display>(data: &I, solution: &Box<dyn DaySolution<I, O>>, part1: bool, example: bool) -> String {
    let start = Instant::now();


    let solution = if part1 {
        solution.part1(&data)
    } else {
        solution.part2(&data)
    };

    let time = (start.elapsed().as_micros() as f64) / 1_000_f64;
    let part = if part1 { "Part 1" } else { "Part 2" };
    let ex = if example { "Example" } else { "Input  " };

    format!("{} :: {} ====> ({:10.3}ms) {:>20}\n", ex, part, time, solution)
}

fn get_and_store_result<I, O: Display>(solution: Box<dyn DaySolution<I, O>>, day_range: Range<u16>) {
    if !day_range.contains(&solution.day()) {
        return;
    }

    let day = solution.day();
    let result = day_solution(solution);
    println!("{}", &result);
    tools::write_to_file(&result, day);
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let mut start_day = 1;
    let mut end_day = 25;
    if args.len() > 1 {
        start_day = args[1].parse::<u16>().unwrap();
        end_day = start_day + 1;
    }
    if args.len() > 2 {
        end_day = args[2].parse::<u16>().unwrap() + 1;
    }
    let day_range = start_day..end_day;
    get_and_store_result(Box::new(day01::Day01Solution {}), day_range.clone());
    get_and_store_result(Box::new(day02::Day02Solution {}), day_range.clone());
}
