use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use crate::{LANG, YEAR};

pub fn read_example(day: u16) -> String {
    let filename = format!("../data/day{:02}-ex.input", day);
    let path = Path::new(&filename);
    let mut file = File::open(path).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();
    contents
}

pub fn read_input(day: u16) -> String {
    let filename = format!("../data/day{:02}-p1.input", day);
    let path = Path::new(&filename);
    let mut file = File::open(path).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();
    contents
}

pub fn write_to_file(res: &String, day: u16) {
    let filename = format!("../result/{}-day{:02}-{}.result", YEAR, day, LANG);
    let path = Path::new(&filename);
    let mut file = File::create(path).unwrap();
    file.write_all(res.as_ref()).unwrap();
}