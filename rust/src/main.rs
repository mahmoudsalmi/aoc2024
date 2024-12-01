use crate::day01::Day01Solution;
use std::fmt::Display;
use std::time::Instant;

mod day01;
mod tools;

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

fn main() {
    let solutions: Vec<Box<dyn DaySolution<_, _>>> = vec![
        Box::new(Day01Solution {}),
    ];

    for solution in solutions {
        let day = solution.day();
        let result = day_solution(solution);
        println!("{}", &result);
        tools::write_to_file(&result, day);
    }
}
