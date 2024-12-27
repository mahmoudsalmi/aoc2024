import { DaySolution, parseData } from './_tools.ts';

enum Operation {
  adv,
  bxl,
  bst,
  jnz,
  bxc,
  out,
  bdv,
  cdv,
}

function fromOpcode(opcode: number): Operation {
  return opcode;
}

type State = { A: number; B: number; C: number };
type Instruction = { op: Operation; operandCode: number };

function getOperand(state: State, operand: number): number {
  if (operand < 4) {
    return operand;
  }
  switch (operand) {
    case 4:
      return state.A;
    case 5:
      return state.B;
    case 6:
      return state.C;
    default:
      throw new Error(`invalid operand: ${operand}`);
  }
}

type InstructionResult = { out: string; instructionPointer: number };
function executeInstruction(state: State, { op, operandCode }: Instruction, instructionPointer: number): InstructionResult {
  let nextInstructionPointer = instructionPointer + 1;
  let out = '';

  switch (op) {
    // The adv instruction (opcode 0) performs division. The numerator is the value in the A register.
    // The denominator is found by raising 2 to the power of the instruction's combo operand.
    // (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.)
    // The result of the division operation is truncated to an integer and then written to the A register.
    case Operation.adv:
      state.A = Math.floor(state.A / Math.pow(2, getOperand(state, operandCode)!));
      break;
    // The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
    case Operation.bxl:
      state.B = state.B ^ operandCode;
      break;
    // The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits),
    // then writes that value to the B register.
    case Operation.bst:
      state.B = getOperand(state, operandCode)! % 8;
      break;
    // The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand;
    // if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
    case Operation.jnz:
      if (state.A === 0) {
        break;
      }
      nextInstructionPointer = operandCode;
      break;
    // The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
    case Operation.bxc:
      state.B = state.B ^ state.C;
      break;
    // The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)
    case Operation.out:
      state.B = getOperand(state, operandCode)! % 8;
      out = state.B.toString();
      break;
    // The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)
    case Operation.bdv:
      state.B = Math.floor(state.A / Math.pow(2, getOperand(state, operandCode)!));
      break;
    // The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)
    case Operation.cdv:
      state.C = Math.floor(state.A / Math.pow(2, getOperand(state, operandCode)!));
      break;
    default:
      throw new Error(`shit happened: ${op}`);
  }
  return { out, instructionPointer: nextInstructionPointer };
}

class Data {
  public initialState: State;
  public instructions: Instruction[];

  constructor(str: string) {
    const lines = str.split('\n');

    this.initialState = {
      A: Number(lines[0].split(':')[1].trim()),
      B: Number(lines[1].split(':')[1].trim()),
      C: Number(lines[2].split(':')[1].trim()),
    };

    this.instructions = [] as Instruction[];
    const instructionsList = lines[4].split(':')[1].trim().split(',');
    for (let i = 0; i < instructionsList.length - 1; i += 2) {
      this.instructions.push({op: fromOpcode(Number(instructionsList[i])), operandCode: Number(instructionsList[i + 1])});
    }
  }
}

export class Day17 implements DaySolution<Data, string> {
  day = 17;

  parseData(dataLabel: 'Example' | 'Input'): Data {
    return new Data(parseData(this.day, dataLabel));
  }

  part1(data: Data): string {
    let nextInstructionPointer = 0;
    const outs = [] as string[];
    const state = {...data.initialState};

    while (nextInstructionPointer < data.instructions.length) {
      const { out, instructionPointer } = executeInstruction(state, data.instructions[nextInstructionPointer], nextInstructionPointer);
      nextInstructionPointer = instructionPointer;
      if (out) {
        outs.push(out);
      }
    }
    return outs.join(',');
  }
  part2 = null;
}
