export function parseTokens<T>(
  data: string,
  transformer: (token: string) => T,
): T[] {
  return data.split(/\s+/)
    .filter(Boolean)
    .map(transformer);
}

export function parseLines<L = string>(
  data: string,
  transformer: (line: string) => L,
  ignoreEmpty = true,
): L[] {
  return data.split(/\r?\n/)
    .filter((line) => Boolean(line) || !ignoreEmpty)
    .map(transformer);
}

export function getTokensByLines<T>(
  data: string,
  transformer: (token: string) => T,
): T[][] {
  return parseLines(data, (line) => parseTokens(line, transformer));
}

export function parseNumbersByLines(data: string): number[][] {
  return getTokensByLines(data, (token) => parseInt(token, 10));
}
