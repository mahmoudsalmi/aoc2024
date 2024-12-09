use std::collections::HashSet;
use crate::tools::read_raw_data;
use crate::DaySolution;
use std::usize;

#[derive(Clone)]
pub struct File {
    id: usize,
    len: usize,
    free: usize,
    free_blocs: Vec<usize>,
    free_remaining: usize,
}

impl File {
    pub fn generate_file_blocs(&self) -> Vec<usize> {
        (0..self.len)
            .map(|_| self.id)
            .collect::<Vec<usize>>()
    }
}

pub type Data = Vec<File>;

pub struct Day09Solution {}

impl DaySolution<Data, usize> for Day09Solution {
    fn day(&self) -> u16 {
        9
    }

    fn parse_input(&self, example: bool) -> Data {
        let raw_data = read_raw_data(self.day(), example);

        let digits = raw_data.chars()
            .filter(|c| c.is_digit(10))
            .map(|c| c.to_digit(10).unwrap() as usize)
            .collect::<Vec<usize>>();

        digits.chunks(2)
            .enumerate()
            .map(|(id, chunk)| {
                let free = *chunk.get(1).unwrap_or(&0);
                File {
                    id: id.try_into().unwrap(),
                    len: chunk[0],
                    free,
                    free_blocs: vec![0; free],
                    free_remaining: free,
                }
            })
            .collect()
    }

    fn part1(&self, input: &Data) -> usize {
        let mut res: usize = 0;
        let mut idx: usize = 0;

        let mut small_idx = 0;
        let mut big_idx = input.len() - 1;

        let mut big_element = input.get(big_idx).unwrap().generate_file_blocs();

        while small_idx < big_idx {
            let small_element = input.get(small_idx).unwrap();

            small_element.generate_file_blocs().iter().for_each(|digit| {
                res += idx * (*digit);
                idx += 1;
            });

            let mut free = small_element.free;
            while free > 0 {
                if big_element.len() == 0 {
                    big_idx -= 1;
                    if small_idx == big_idx {
                        break;
                    }
                    big_element = input.get(big_idx).unwrap().generate_file_blocs();
                }
                let digit = big_element.pop().unwrap();
                res += idx * digit;
                idx += 1;
                free -= 1;
            }

            small_idx += 1;
        }
        while big_element.len() > 0 {
            let digit = big_element.pop().unwrap();
            res += idx * digit;
            idx += 1;
        }
        res
    }

    fn part2(&self, input: &Data) -> usize {
        let mut data = input.clone();
        let mut moved = HashSet::<usize>::new();

        input.iter().rev().for_each(|file| {
            if let Some(free_file) = data.iter_mut().find(|free_file| { free_file.free_remaining >= file.len && free_file.id < file.id }) {
                (free_file.free - free_file.free_remaining..free_file.free - free_file.free_remaining + file.len).for_each(|i| {
                    free_file.free_blocs[i] = file.id;
                });
                moved.insert(file.id);
                free_file.free_remaining -= file.len;
            }
        });

        let mut res = 0_usize;
        let mut idx = 0_usize;

        data.into_iter().for_each(|file| {
            if moved.contains(&file.id) {
                idx += file.len;
            } else {
                file.generate_file_blocs().iter().for_each(|digit| {
                    res += idx * (*digit);
                    idx += 1;
                });
            }

            file.free_blocs.iter().for_each(|digit| {
                res += idx * (*digit);
                idx += 1;
            });
        });
        res

    }
}

// 6361380647183
// 6358866059387
