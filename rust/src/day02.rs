use crate::tools::{read_example, read_input};
use crate::DaySolution;

pub struct Day02 {}

impl Day02 {
    fn is_safe(&self, report: &Vec<i32>) -> bool {
        let increase = report[1] - report[0] >= 0;
        report.windows(2)
            .all(|pair| {
                let diff = pair[1] - pair[0];
                let pair_increase = diff >= 0;
                increase == pair_increase && diff.abs() <= 3 && diff.abs() >= 1
            })
    }
}

impl DaySolution<Vec<Vec<i32>>, i32> for Day02 {
    fn day(&self) -> u16 {
        2_u16
    }

    fn parse_input(&self, example: bool) -> Vec<Vec<i32>> {
        let raw_data = if example {
            read_example(self.day())
        } else {
            read_input(self.day())
        };

        raw_data.lines()
            .filter(|line| !line.is_empty())
            .map(|line| {
                line.split_whitespace()
                    .map(|x| x.parse().unwrap())
                    .collect()
            })
            .collect()
    }

    fn part1(&self, input: &Vec<Vec<i32>>) -> i32 {
        input.iter()
            .map(|report| self.is_safe(&report))
            .filter(|&safe| safe)
            .count() as i32
    }

    fn part2(&self, input: &Vec<Vec<i32>>) -> i32 {
        input.iter()
            .map(|report| {
                (0..report.len())
                    .map(|i| {
                        let mut new_report = report.clone();
                        new_report.remove(i);
                        new_report
                    })
                    .any(|report| self.is_safe(&report))
            })
            .filter(|&safe| safe)
            .count() as i32
    }
}
