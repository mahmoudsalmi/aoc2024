use std::collections::HashSet;
use crate::tools::read_raw_data;
use crate::DaySolution;

#[derive(Clone, Copy, Eq, PartialEq, Hash)]
pub struct Position {
    x: i32,
    y: i32,
}

impl Position {
    pub fn new(x: i32, y: i32) -> Self {
        Position { x, y }
    }
}

#[derive(Clone, Copy, Eq, PartialEq, Hash)]
pub struct TailHead {
    tail: Position,
    head: Position,
}

pub struct Data(Vec<Vec<i32>>);
impl Data {
    fn width(&self) -> i32 {
        self.0[0].len() as i32
    }

    fn height(&self) -> i32 {
        self.0.len() as i32
    }

    fn is_valid(&self, pos: Position) -> bool {
        pos.x >= 0 && pos.x < self.width() && pos.y >= 0 && pos.y < self.height()
    }

    fn get(&self, pos: Position) -> i32 {
        self.0[pos.y as usize][pos.x as usize]
    }

    fn next_pos(&self, pos: Position) -> Vec<Position> {
        vec![
            Position::new(pos.x + 1, pos.y),
            Position::new(pos.x - 1, pos.y),
            Position::new(pos.x, pos.y + 1),
            Position::new(pos.x, pos.y - 1),
        ].iter()
            .cloned()
            .filter(|p| self.is_valid(*p))
            .collect::<Vec<Position>>()
    }

    fn get_all_tail_heads(&self) -> Vec<TailHead> {
        (0..self.height())
            .flat_map(|y| (0..self.width()).map(move |x| Position::new(x, y)))
            .filter(|pos| self.get(*pos) == 0)
            .flat_map(|head| self.get_tails(head).iter().map(|tail| TailHead { tail: *tail, head }).collect::<Vec<TailHead>>())
            .collect::<Vec<TailHead>>()
    }

    fn get_tails(&self, head: Position) -> Vec<Position> {
        let current_value = self.get(head);
        if current_value == 9 {
            return vec![head];
        }
        self.next_pos(head)
            .iter()
            .filter(|pos| self.get(**pos) == current_value + 1)
            .flat_map(|pos| self.get_tails(*pos))
            .collect::<Vec<Position>>()
    }
}

pub struct Day10;

impl DaySolution<Data, i32> for Day10 {
    fn day(&self) -> u16 {
        10
    }

    fn parse_input(&self, example: bool) -> Data {
        let raw_data = read_raw_data(self.day(), example);

        Data(
            raw_data
                .lines()
                .map(|line| {
                    line.chars()
                        .map(|c| c.to_digit(10).unwrap() as i32)
                        .collect()
                })
                .collect(),
        )
    }

    fn part1(&self, input: &Data) -> i32 {
        input.get_all_tail_heads().iter().cloned().collect::<HashSet<TailHead>>().len() as i32
    }

    fn part2(&self, input: &Data) -> i32 {
        input.get_all_tail_heads().len() as i32
    }
}
