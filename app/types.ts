export interface ISlotConfig {
  reelsCount: number;
  rowsCount: number;
  symbols: { [key: number]: number[] };
  lines: number[][];
  reels: number[][];
}
