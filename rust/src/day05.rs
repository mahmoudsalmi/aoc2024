use crate::tools::read_raw_data;
use crate::DaySolution;
use std::cmp::Ordering;
use std::collections::HashMap;

struct SortRule(HashMap<(i32, i32), Ordering>);
impl SortRule {
    fn new() -> Self {
        SortRule(HashMap::<(i32, i32), Ordering>::new())
    }

    fn add_rule(&mut self, str: &str) {
        let v = str.split("|").map(|s| { s.parse::<i32>().unwrap() }).collect::<Vec<i32>>();
        self.0.insert((v[0], v[1]), Ordering::Less);
        self.0.insert((v[1], v[0]), Ordering::Greater);
    }

    fn get_rule(&self, a: i32, b: i32) -> Ordering {
        *self.0.get(&(a, b)).unwrap_or(&Ordering::Equal)
    }

    fn is_sorted(&self, list: &Vec<i32>) -> bool {
        list.windows(2).all(|w| { self.get_rule(w[0], w[1]) == Ordering::Less })
    }
}

pub struct Data(SortRule, Vec<Vec<i32>>);

pub struct Day05;

impl DaySolution<Data, i32> for Day05 {
    fn new() -> Self {
        Day05 {}
    }

    fn day(&self) -> u16 {
        5
    }

    fn parse_input(&mut self, example: bool) -> Data {
        let raw_data = read_raw_data(self.day(), example);
        let mut read_rules = true;
        let mut data = Data(SortRule::new(), Vec::new());
        raw_data.lines().for_each(|line| {
            if line.trim().is_empty() {
                read_rules = false;
                return;
            }

            if read_rules {
                data.0.add_rule(line);
            } else {
                data.1.push(line.split(",").map(|s| { s.parse::<i32>().unwrap() }).collect());
            }
        });
        data
    }

    fn part1(&mut self, input: &Data) -> i32 {
        let rules = &input.0;
        let lists = &input.1;
        lists.iter()
            .filter(|list| { rules.is_sorted(list) })
            .map(|list| { list[list.len() / 2] })
            .sum()
    }

    fn part2(&mut self, input: &Data) -> i32 {
        let rules = &input.0;
        let lists = &input.1;
        lists.iter()
            .filter(|list| { !rules.is_sorted(list) })
            .map(|list| {
                let mut sorted = list.clone();
                sorted.sort_by(|a, b| { rules.get_rule(*a, *b) });
                sorted[sorted.len() / 2]
            })
            .sum()
    }
}
