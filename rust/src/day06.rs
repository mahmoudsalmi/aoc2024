use std::collections::HashSet;
use crate::tools::read_raw_data;
use crate::DaySolution;

const OBSTACLE: char = '#';
const GUARD: [char; 4] = ['^', '>', 'v', '<'];

#[derive(Clone, Debug)]
struct Position {
    x: usize,
    y: usize,
}

#[derive(PartialEq, Debug)]
enum Op {
    TurnRight,
    Forward,
    NoOp,
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
enum Direction {
    Up,
    Right,
    Down,
    Left,
}
impl Direction {
    fn from(c: &char) -> Direction {
        match c {
            '^' => Direction::Up,
            '>' => Direction::Right,
            'v' => Direction::Down,
            '<' => Direction::Left,
            _ => panic!("Invalid direction"),
        }
    }
}

#[derive(Clone)]
pub struct Data {
    grid: Vec<Vec<bool>>,
    current: Position,
    direction: Direction,
}

impl Data {
    fn new() -> Self {
        Data {
            grid: Vec::new(),
            current: Position { x: 0, y: 0 },
            direction: Direction::Up,
        }
    }

    fn add_line(&mut self, line: &str) {
        let row: Vec<bool> = line.chars().map(|c| { c == OBSTACLE }).collect();
        GUARD.iter().for_each(|&guard| {
            if let Some(idx) = line.find(guard) {
                self.direction = Direction::from(&guard);
                self.current = Position {
                    x: idx,
                    y: self.grid.len(),
                };
            }
        });

        self.grid.push(row);
    }

    fn width(&self) -> usize {
        self.grid[0].len()
    }

    fn height(&self) -> usize {
        self.grid.len()
    }

    fn is_obstacle(&self, x: usize, y: usize) -> bool {
        self.grid[y][x]
    }

    fn next(&mut self) -> Op {
        let Position { x, y } = self.current;
        match self.direction {
            Direction::Up => {
                if y == 0 {
                    Op::NoOp
                } else if self.is_obstacle(x, y - 1) {
                    self.direction = Direction::Right;
                    Op::TurnRight
                } else {
                    self.current.y -= 1;
                    Op::Forward
                }
            }
            Direction::Right => {
                if x == self.width() - 1 {
                    Op::NoOp
                } else if self.is_obstacle(x + 1, y) {
                    self.direction = Direction::Down;
                    Op::TurnRight
                } else {
                    self.current.x += 1;
                    Op::Forward
                }
            }
            Direction::Down => {
                if y == self.height() - 1 {
                    Op::NoOp
                } else if self.is_obstacle(x, y + 1) {
                    self.direction = Direction::Left;
                    Op::TurnRight
                } else {
                    self.current.y += 1;
                    Op::Forward
                }
            }
            Direction::Left => {
                if x == 0 {
                    Op::NoOp
                } else if self.is_obstacle(x - 1, y) {
                    self.direction = Direction::Up;
                    Op::TurnRight
                } else {
                    self.current.x -= 1;
                    Op::Forward
                }
            }
        }
    }

    fn walk_into(&self) -> Option<Vec<Vec<HashSet<Direction>>>> {
        let mut visited = vec![vec![HashSet::new(); self.width()]; self.height()];

        let mut input = self.clone();
        visited[*&input.current.y][*&input.current.x].insert(input.direction.clone());

        while Op::NoOp != input.next() {
            if visited[*&input.current.y][*&input.current.x].contains(&input.direction.clone()) {
                return None;
            }
            visited[*&input.current.y][*&input.current.x].insert(input.direction.clone());
        }

        Some(visited)

    }
}

pub struct Day06Solution;

impl DaySolution<Data, usize> for Day06Solution {
    fn day(&self) -> u16 {
        6
    }

    fn parse_input(&self, example: bool) -> Data {
        read_raw_data(self.day(), example)
            .lines()
            .fold(Data::new(), |mut data, line| {
                data.add_line(line);
                data
            })
    }

    fn part1(&self, input: &Data) -> usize {
        input.walk_into().unwrap().iter()
            .flatten()
            .filter(|directions| directions.len() >= 1)
            .count()
    }


    fn part2(&self, input: &Data) -> usize {
        input.grid.iter()
            .enumerate()
            .map(|(y, row)| row.iter().enumerate().map(move |(x, is_obstacle)| {(x, y, is_obstacle)}))
            .flatten()
            .filter(|(_, _, is_obstacle)| !**is_obstacle)
            .filter(|(x, y, _)| {
                let mut data = input.clone();
                if data.grid[*y][*x] {
                    return false;
                }
                data.grid[*y][*x] = true;
                data.walk_into().is_none()
            })
            .count()
    }
}
