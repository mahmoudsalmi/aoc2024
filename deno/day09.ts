import { DaySolution, parseData } from './_tools.ts';

type Data = number[];

class Blocs {
  blocs: (number | null)[];
  freeSize: number;

  private constructor(
    public size: number,
    value: number | null,
  ) {
    this.blocs = new Array(size).fill(value);
    this.freeSize = this.blocs.filter((b) => b === null).length;
  }

  // ------------------------------------------------------------ Builder
  static blocsList(digits: Data): Blocs[] {
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

  // ------------------------------------------------------------ Move
  static movePartial(fromBlocs: Blocs, toBlocs: Blocs): number {
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

  static moveFull(fromBlocs: Blocs, toBlocs: Blocs): boolean {
    if (fromBlocs.isEmpty() || toBlocs.isFull()) {
      return false;
    }

    if (fromBlocs.isFull() && fromBlocs.size <= toBlocs.freeSize) {
      const moved = this.movePartial(fromBlocs, toBlocs);
      if (moved !== fromBlocs.size) throw new Error('Error while moving all blocs');
      return true;
    }
    return false;
  }

  // ------------------------------------------------------------ Checksum
  static checksum(blocsList: Blocs[]): number {
    let res = 0;
    let idx = 0;
    blocsList.forEach((blocs) => {
      blocs.blocs.forEach((bloc) => {
        if (bloc !== null) res += bloc * idx;
        idx++;
      });
    });
    return res;
  }

  // ------------------------------------------------------------ Utils
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
    return this.blocs.findIndex((b) => b === null);
  }
}

export class Day09 implements DaySolution<Data, number> {
  day = 9;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    return parseData(this.day, dataLabel).split('').filter((c) => /^\d$/.test(c)).map((v) => parseInt(v));
  }

  part1(digits: Data): number {
    const blocsList = Blocs.blocsList(digits);

    let [to, from] = [0, blocsList.length - 1];

    while (to < from) {
      Blocs.movePartial(blocsList[from], blocsList[to]);

      if (blocsList[to].isFull()) to++;
      if (blocsList[from].isEmpty()) from--;
    }

    return Blocs.checksum(blocsList);
  }

  part2(digits: Data): number {
    const blocsList = Blocs.blocsList(digits);
    for (let from = blocsList.length - 1; from >= 0; from--) {
      const fromBlocs = blocsList[from];

      let to = 0;
      while (to <= from && !Blocs.moveFull(fromBlocs, blocsList[to])) {
        to++;
      }
    }

    return Blocs.checksum(blocsList);
  }
}
