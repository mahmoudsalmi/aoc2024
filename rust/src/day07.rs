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

fn generate_combinaisons(size: usize, base_ops: Vec<Op>, prefix: Vec<Op>) -> Vec<Vec<Op>> {
    if size == 0 {
        vec![prefix]
    } else {
        base_ops.iter()
            .flat_map(|op| {
                let mut prefix = prefix.clone();
                prefix.push(op.clone());
                generate_combinaisons(size - 1, base_ops.clone(), prefix)
            })
            .collect()
    }
}

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
        generate_combinaisons(self.1.len() - 1, base_opts, vec![])
            .iter()
            .any(|ops| {
                let mut res = self.1[0];
                for i in 1..self.1.len() {
                    res = ops[i - 1].apply(res, self.1[i]);
                }
                res == self.0
            })
    }
}

pub type Data = Vec<Problem>;

pub struct Day07Solution;

impl DaySolution<Data, i128> for Day07Solution {
    fn day(&self) -> u16 {
        7
    }

    fn parse_input(&self, example: bool) -> Data {
        let raw_data = read_raw_data(7, example);
        raw_data.lines().map(|l| l.into()).collect()
    }

    fn part1(&self, input: &Data) -> i128 {
        input
            .iter()
            .filter(|p| p.check(OPS_1.to_vec()))
            .map(|problem| problem.0)
            .sum()
    }

    fn part2(&self, input: &Data) -> i128 {
        input
            .iter()
            .filter(|p| p.check(OPS_2.to_vec()))
            .map(|problem| problem.0)
            .sum()
    }
}
