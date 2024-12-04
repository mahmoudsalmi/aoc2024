use std::collections::HashSet;
use crate::tools::read_raw_data;
use crate::DaySolution;

#[derive(Clone)]
pub struct V2(i16, i16);
impl V2 {
    fn x(&self) -> i16 {
        self.0
    }
    fn y(&self) -> i16 {
        self.1
    }
}

const WORD: [char; 4] = ['X', 'M', 'A', 'S'];

const ALL_DIRECTIONS: [V2; 8] = [
    V2(0, 1),
    V2(1, 0),
    V2(0, -1),
    V2(-1, 0),
    V2(1, 1),
    V2(1, -1),
    V2(-1, 1),
    V2(-1, -1),
];

const X_MAX_DIAGRAM_DIRECTIONS: [[V2; 2]; 2] = [
    [V2(-1, -1), V2(1, 1)],
    [V2(1, -1), V2(-1, 1)],
];

pub struct Grid(Vec<Vec<char>>);

impl Grid {
    fn new() -> Self {
        Grid(Vec::new())
    }

    fn add_row(&mut self, row: &str) {
        self.0.push(row.chars().collect());
    }

    fn get(&self, i: &V2) -> Option<char> {
        if i.x() < 0 || i.x() >= self.width() || i.y() < 0 || i.y() >= self.height() {
            return None;
        }
        Some(self.0[i.y() as usize][i.x() as usize])
    }

    fn width(&self) -> i16 {
        self.0[0].len() as i16
    }

    fn height(&self) -> i16 {
        self.0.len() as i16
    }

    fn next_el(&self, current: &V2, direction: &V2) -> Option<V2> {
        let next = V2(current.x() + direction.x(), current.y() + direction.y());
        if next.x() < 0 || next.x() >= self.width() || next.y() < 0 || next.y() >= self.height() {
            None
        } else {
            Some(next.clone())
        }
    }

    fn check_word(&self, i: &V2) -> i32 {
        let mut count = 0;
        for direction in ALL_DIRECTIONS.iter() {
            let mut l= 0;
            let mut next = Some(i.clone());
            while l < WORD.len() && next.is_some() && self.get(&next.clone().unwrap()).unwrap_or(' ') == WORD[l] {
                if l == WORD.len() - 1 {
                    count += 1;
                }
                next = self.next_el(&next.unwrap(), direction);
                l+=1;
            }
        }
        count
    }

    fn check_xmas_diagram(&self, i: &V2) -> bool {
        if self.get(i).unwrap() != 'A' {
            return false;
        }
        for directions in X_MAX_DIAGRAM_DIRECTIONS.iter() {
            let chars = directions.iter()
                .filter_map(|d| self.next_el(&i, d))
                .filter_map(|next| self.get(&next))
                .collect::<HashSet<char>>();

            if (!chars.contains(&'M')) || !chars.contains(&'S') {
                return false;
            }
        }
        true
    }

    fn for_each<F>(&self, mut func: F)
    where
        F: FnMut(&V2, char),
    {
        for y in 0..self.height() {
            for x in 0..self.width() {
                let i = V2(x, y);
                func(&i, self.get(&i).unwrap());
            }
        }
    }
}


pub struct Day04Solution {}

impl DaySolution<Grid, i32> for Day04Solution {
    fn day(&self) -> u16 {
        4
    }

    fn parse_input(&self, example: bool) -> Grid {
        let raw_data = read_raw_data(self.day(), example);
        let mut grid = Grid::new();
        for line in raw_data.lines() {
            grid.add_row(line);
        }
        grid
    }

    fn part1(&self, input: &Grid) -> i32 {
        let mut count = 0;
        input.for_each(|i, _c| {
            count += input.check_word(i);
        });
        count
    }

    fn part2(&self, input: &Grid) -> i32 {
        let mut count = 0;
        input.for_each(|i, _c| {
            count += if input.check_xmas_diagram(i) { 1 } else { 0 };
        });
        count
    }
}
