use crate::tools::read_raw_data;
use crate::DaySolution;
use regex::Regex;

pub struct Day03 {}

impl Day03 {
    pub fn get_mul_operations(&self, line: String) -> Vec<String> {
        Regex::new(r"mul\(\d{1,3},\d{1,3}\)")
            .unwrap()
            .find_iter(&line)
            .map(|mat| mat.as_str().to_string())
            .collect()
    }

    pub fn get_operations(&self, line: String) -> Vec<String> {
        Regex::new(r"(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))")
            .unwrap()
            .find_iter(&line)
            .map(|mat| mat.as_str().to_string())
            .collect()
    }

    pub fn exec_operation(&self, operation: &str) -> i32 {
        Regex::new(r"\d{1,3}")
            .unwrap()
            .find_iter(operation)
            .map(|mat| mat.as_str().parse::<i32>().unwrap())
            .product()
    }
}

impl DaySolution<Vec<String>, i32> for Day03 {
    fn new() -> Self {
        Day03 {}
    }

    fn day(&self) -> u16 {
        3
    }

    fn parse_input(&mut self, example: bool) -> Vec<String> {
        read_raw_data(self.day(), example)
            .lines()
            .filter(|line| !line.is_empty())
            .map(|line| line.to_string())
            .collect()
    }

    fn part1(&mut self, input: &Vec<String>) -> i32 {
        self.get_mul_operations(input.join(" "))
            .iter()
            .map(|operation| self.exec_operation(operation))
            .sum::<i32>()
    }

    fn part2(&mut self, input: &Vec<String>) -> i32 {
        let mut activate = true;
        self.get_operations(input.join(" "))
            .iter()
            .filter_map(|op| match op.as_str() {
                "do()" => {
                    activate = true;
                    None
                }
                "don't()" => {
                    activate = false;
                    None
                }
                _ if activate => Some(op),
                _ => None,
            })
            .map(|operation| self.exec_operation(operation))
            .sum::<i32>()
    }
}
