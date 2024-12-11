use crate::tools::read_raw_data;
use crate::DaySolution;
use std::collections::{HashMap, HashSet};
use std::ops::{Add, Sub};

#[derive(Clone, Copy, Hash, Eq, PartialEq)]
struct Position {
    x: i32,
    y: i32,
}

impl Position {
    fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }
}

impl Add for Position {
    type Output = Position;

    fn add(self, rhs: Self) -> Self::Output {
        Position::new(self.x + rhs.x, self.y + rhs.y)
    }
}

impl Sub for Position {
    type Output = Position;

    fn sub(self, rhs: Self) -> Self::Output {
        Position::new(self.x - rhs.x, self.y - rhs.y)
    }
}

pub struct Data {
    width: i32,
    height: i32,
    all: HashSet<Position>,
    indexed: HashMap<char, HashSet<Position>>,
}

impl Data {
    fn new(width: i32, height: i32) -> Self {
        Self {
            width,
            height,
            all: HashSet::new(),
            indexed: HashMap::new(),
        }
    }

    fn add_antenna(&mut self, c: char, x: i32, y: i32) {
        let pos = Position::new(x, y);
        self.all.insert(pos);
        self.indexed
            .entry(c)
            .or_insert(HashSet::new())
            .insert(pos);
    }

    fn in_grid(&self, pos: &Position) -> bool {
        pos.x >= 0 && pos.x < self.width && pos.y >= 0 && pos.y < self.height
    }

    fn calculate_antinodes(&self, antenna1: Position, antenna2: Position, with_resonance: bool) -> Vec<Position> {
        let diff = antenna2 - antenna1;
        if diff.x == 0 && diff.y == 0 {
            return Vec::new();
        }

        let mut antinodes = Vec::new();
        let mut antinode: Position;

        if !with_resonance {
            antinode = antenna2 + diff;
            if self.in_grid(&antinode) {
                antinodes.push(antinode);
            }
            antinode = antenna1 - diff;
            if self.in_grid(&antinode) {
                antinodes.push(antinode);
            }
        } else {
            antinode = antenna2.clone();
            while self.in_grid(&antinode) {
                antinodes.push(antinode);
                antinode = antinode + diff;
            }
            antinode = antenna1.clone();
            while self.in_grid(&antinode) {
                antinodes.push(antinode);
                antinode = antinode - diff;
            }
        }

        antinodes
    }

    fn calculate_all_antinodes(&self, with_resonance: bool) -> HashSet<Position> {
        self.indexed.values()
            .flat_map(|antennas| {
                antennas.iter().flat_map(|antenna1| {
                    antennas.iter().flat_map(move |antenna2| {
                        self.calculate_antinodes(*antenna1, *antenna2, with_resonance)
                    })
                })
            })
            .collect::<HashSet<Position>>()
    }
}

pub struct Day08;

impl DaySolution<Data, usize> for Day08 {
    fn new() -> Self {
        Self {}
    }

    fn day(&self) -> u16 { 8 }

    fn parse_input(&mut self, example: bool) -> Data {
        let raw_data = read_raw_data(self.day(), example);
        let raw_data = raw_data.lines().collect::<Vec<&str>>();

        let mut data = Data::new(raw_data[0].len() as i32, raw_data.len() as i32);

        raw_data.iter().enumerate().for_each(|(y, line)| {
            line.chars().enumerate().for_each(|(x, c)| {
                if c != '.' {
                    data.add_antenna(c, x as i32, y as i32);
                }
            });
        });

        data
    }

    fn part1(&mut self, input: &Data) -> usize {
        input.calculate_all_antinodes(false).len()
    }

    fn part2(&mut self, input: &Data) -> usize {
        input.calculate_all_antinodes(true).len()
    }
}
