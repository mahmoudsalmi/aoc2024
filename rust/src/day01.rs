use crate::tools::{read_example, read_input};
use crate::DaySolution;
use std::collections::HashMap;

pub struct Day01 {}

impl DaySolution<(Vec<i32>, Vec<i32>), i32> for Day01 {
    fn new() -> Self {
        Day01 {}
    }

    fn day(&self) -> u16 {
        1
    }

    fn parse_input(&mut self, example: bool) -> (Vec<i32>, Vec<i32>) {
        let mut res = (vec![], vec![]);
        let raw_data = if example {
            read_example(self.day())
        } else {
            read_input(self.day())
        };

        for line in raw_data.lines() {
            let parts = line.split_whitespace().collect::<Vec<&str>>();
            if parts.len() == 2 {
                res.0.push(parts[0].parse().unwrap());
                res.1.push(parts[1].parse().unwrap());
            }
        }
        res
    }

    fn part1(&mut self, input: &(Vec<i32>, Vec<i32>)) -> i32 {
        let mut left = input.0.clone();
        let mut right = input.1.clone();
        left.sort();
        right.sort();

        left.iter()
            .zip(right.iter())
            .map(|(l, r)| (l - r).abs())
            .sum()
    }

    fn part2(&mut self, input: &(Vec<i32>, Vec<i32>)) -> i32 {
        let scores = input.1.iter().fold(HashMap::new(), |mut acc, &x| {
            acc.entry(x).and_modify(|e| *e += 1).or_insert(1);
            acc
        });
        input
            .0
            .iter()
            .map(|x| scores.get(x).unwrap_or(&0) * x)
            .sum()
    }
}
