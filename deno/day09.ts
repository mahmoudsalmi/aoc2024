import { DaySolution, parseData } from './_tools.ts';

type Data = number[];

class Blocs {
  blocs: (number | null)[];
  freeSize: number;

  constructor(
    public size: number,
    value: number | null,
  ) {
    this.blocs = new Array(size).fill(value);
    this.freeSize = this.blocs.filter((b) => b === null).length;
  }

  static toBlocsList(digits: Data): Blocs[] {
    const data: Blocs[] = [];
    let file = true;
    let fileIdx = 0;

    for (const digit of digits) {
      if (file) {
        data.push(Blocs.fileBlocs(digit, fileIdx));
        fileIdx++;
      } else {
        data.push(Blocs.freeBlocs(digit));
      }
      file = !file;
    }

    return data;
  }

  static fileBlocs(size: number, value: number): Blocs {
    return new Blocs(size, value);
  }

  static freeBlocs(size: number): Blocs {
    return new Blocs(size, null);
  }

  static moveToPartialTo(fromBlocs: Blocs, toBlocs: Blocs): number {
    let fromBlocsId = fromBlocs.lastNonFreeBlocIdx();
    let toBlocsId = toBlocs.firstFreeBlocIdx();

    if (fromBlocsId < 0 || fromBlocsId < 0) {
      return 0;
    }

    let moved = 0;
    while (!toBlocs.isFull() && !fromBlocs.isEmpty()) {
      const value = fromBlocs.blocs[fromBlocsId];

      fromBlocs.blocs[fromBlocsId] = null;
      fromBlocs.freeSize++;
      fromBlocsId--;

      toBlocs.blocs[toBlocsId] = value;
      toBlocs.freeSize--;
      toBlocsId++;

      moved++;
    }
    return moved;
  }

  static moveAllBlocs(fromBlocs: Blocs, toBlocs: Blocs): boolean {
    if (fromBlocs.isEmpty() || toBlocs.isFull()) {
      return false;
    }

    if (fromBlocs.isFull() && fromBlocs.size <= toBlocs.freeSize) {
      const moved = this.moveToPartialTo(fromBlocs, toBlocs);
      if (moved !== fromBlocs.size) throw new Error('Error while moving all blocs');
      return true;
    }
    return false;
  }

  isEmpty(): boolean {
    return this.size === this.freeSize;
  }

  isFull(): boolean {
    return this.freeSize === 0;
  }

  private lastNonFreeBlocIdx(): number {
    return this.blocs.findLastIndex((b) => b !== null);
  }

  private firstFreeBlocIdx(): number {
    if (this.freeSize === 0) return -1;
    return this.blocs.findIndex((b) => b === null);
  }
}

export class Day09 implements DaySolution<Data, number> {
  day = 9;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    return parseData(this.day, dataLabel).split('').filter((c) => /^\d$/.test(c)).map((v) => parseInt(v));
  }

  part1(digits: Data): number {
    const data = Blocs.toBlocsList(digits);
    let small = 0;
    let big = data.length - 1;

    // ------------------------- move blocs
    let smallBlocs = data[small];
    let bigBlocs = data[big];
    while (small < big) {
      Blocs.moveToPartialTo(data[big], data[small]);
      if (smallBlocs.isFull()) {
        small++;
        smallBlocs = data[small];
      }
      if (bigBlocs.isEmpty()) {
        big--;
        bigBlocs = data[big];
      }
    }

    // ------------------------- chucksum
    let res = 0;
    let idx = 0;
    data.forEach((blocs) => {
      blocs.blocs.forEach((bloc) => {
        if (bloc !== null) res += bloc * idx;
        idx++;
      });
    });
    return res;
  }

  part2(digits: Data): number {
    const data = Blocs.toBlocsList(digits);
    for (let i = data.length - 1; i >= 0; i--) {
      const fromBlocs = data[i];

      let j = 0;
      let moved = false;
      while (!moved && j <= i) {
        const toBlocs = data[j];
        moved = Blocs.moveAllBlocs(fromBlocs, toBlocs);
        j++;
      }
    }

    // ------------------------- chucksum
    let res = 0;
    let idx = 0;
    data.forEach((blocs) => {
      blocs.blocs.forEach((bloc) => {
        if (bloc !== null) res += bloc * idx;
        idx++;
      });
    });
    return res;
  }
}
