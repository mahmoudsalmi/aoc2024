use crate::tools::read_raw_data;
use crate::DaySolution;

#[derive(Clone, Debug)]
enum Op {
    Add,
    Mul,
    Concat,
}

impl Op {
    fn apply(&self, a: i128, b: i128) -> i128 {
        match self {
            Op::Add => a + b,
            Op::Mul => a * b,
            Op::Concat => format!("{}{}", a, b).parse().unwrap()
        }
    }
}

const OPS_1: [Op; 2] = [Op::Add, Op::Mul];
const OPS_2: [Op; 3] = [Op::Add, Op::Mul, Op::Concat];

#[derive(Debug)]
pub struct Problem(i128, Vec<i128>);
impl From<&str> for Problem {
    fn from(s: &str) -> Self {
        let [target_s, numbers_s] = s.split(':').collect::<Vec<&str>>()[..] else { panic!("Invalid input") };

        Problem(
            target_s.parse().unwrap(),
            numbers_s.trim().split(' ').map(|n| n.parse().unwrap()).collect(),
        )
    }
}
impl Problem {
    fn check(&self, base_opts: Vec<Op>) -> bool {
        self.check_rec(base_opts, self.1[0], 1).is_some()
    }

    fn check_rec(&self, base_opts: Vec<Op>, previous_res: i128, idx: usize) -> Option<i128> {
        if idx == self.1.len() {
            if previous_res == self.0 {
                Some(previous_res)
            } else {
                None
            }
        } else {
            base_opts.iter()
                .filter_map(|op| {
                    self.check_rec(base_opts.clone(), op.apply(previous_res, self.1[idx]), idx + 1)
                })
                .next()
        }
    }
}

pub type Data = Vec<Problem>;

pub struct Day07;

impl DaySolution<Data, i128> for Day07 {
    fn new() -> Self {
        Self {}
    }

    fn day(&self) -> u16 {
        7
    }

    fn parse_input(&mut self, example: bool) -> Data {
        let raw_data = read_raw_data(7, example);
        raw_data.lines().map(|l| l.into()).collect()
    }

    fn part1(&mut self, input: &Data) -> i128 {
        input
            .iter()
            .filter(|p| p.check(OPS_1.to_vec()))
            .map(|problem| problem.0)
            .sum()
    }

    fn part2(&mut self, input: &Data) -> i128 {
        input
            .iter()
            .filter(|p| p.check(OPS_2.to_vec()))
            .map(|problem| problem.0)
            .sum()
    }
}
