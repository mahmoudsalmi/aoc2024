use crate::tools::read_raw_data;
use crate::DaySolution;
use std::collections::HashMap;

pub struct Day11 {
    cache: HashMap<(usize, usize), usize>,
}

impl Day11 {
    fn blink(&mut self, stone: usize, step: usize) -> usize {
        let id = (stone, step);

        if step == 0 {
            return 1;
        }

        if let Some(res) = self.cache.get(&id) {
            return *res;
        }

        if stone == 0 {
            let res = self.blink(1, step - 1);
            self.cache.insert(id, res);
            return res;
        }

        let stone_str = format!("{}", stone);
        if stone_str.len() % 2 == 0 {
            let half = stone_str.len()/2;
            let res =
                self.blink(stone_str[0..half].parse::<usize>().unwrap(), step - 1)
                    + self.blink(stone_str[half..].parse::<usize>().unwrap(), step - 1);
            self.cache.insert(id, res);
            return res;
        }

        let res = self.blink(stone * 2024, step - 1);
        self.cache.insert(id, res);
        res
    }
}

impl DaySolution<Vec<usize>, usize> for Day11 {
    fn new() -> Self {
        Self {
            cache: HashMap::new(),
        }
    }

    fn day(&self) -> u16 {
        11
    }

    fn parse_input(&mut self, example: bool) -> Vec<usize> {
        let raw_data = read_raw_data(self.day(), example);
        raw_data
            .lines()
            .flat_map(|line| {
                line.split_whitespace()
                    .filter(|p| !p.is_empty())
                    .map(|s| s.parse::<usize>().unwrap())
                    .collect::<Vec<usize>>()
            })
            .collect::<Vec<usize>>()
    }

    fn part1(&mut self, input: &Vec<usize>) -> usize {
        input.iter().map(|stone| self.blink(stone.clone(), 25)).sum()
    }

    fn part2(&mut self, input: &Vec<usize>) -> usize {
        input.iter().map(|stone| self.blink(stone.clone(), 75)).sum()
    }
}
