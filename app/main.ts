import { ISlotConfig } from "./types.js";
import { gameConfig } from "./gameConfig.js";

class SlotGame {
  private config: ISlotConfig;

  constructor(config: ISlotConfig) {
    this.config = config;
  }
  // method to spin a single reel and get symbols for each row(config.rowsCount) based on config.reels values for that particular reel
  private spinReel(reelIndex: number): number[] {
    const reel: number[] = [];
    //pick a random index based on current reel length;
    const startReelIndex = Math.floor(
      Math.random() * this.config.reels[reelIndex].length
    );
    //pick reel symbols based on the random index
    for (
      let i = startReelIndex;
      i < startReelIndex + this.config.rowsCount;
      i++
    ) {
      reel.push(
        this.config.reels[reelIndex][i % this.config.reels[reelIndex].length]
      );
    }
    return reel;
  }
  //method for simulating a single slot spin returning symbols for all 5 reels across all 3 rows and respective lines payout based on symbols
  private spinResult(): {
    reelsPosition: number[][];
    symbolsOnScreen: number[][];
    linesPayout: number[];
  } {
    const result: {
      reelsPosition: number[][];
      symbolsOnScreen: number[][];
      linesPayout: number[];
    } = {
      reelsPosition: [],
      symbolsOnScreen: [],
      linesPayout: [],
    };
    //save all 5 reels as a matrix
    for (let i = 0; i < this.config.reelsCount; i++) {
      const reel = this.spinReel(i);
      result.reelsPosition.push(reel);
    }
    //transpose 5x3 reel matrix into 3x5 to illustrate symbols on the screen for every row and reel
    for (let i = 0; i < this.config.rowsCount; i++) {
      const symbolsOnRow: number[] = [];
      for (let j = 0; j < this.config.reelsCount; j++) {
        symbolsOnRow.push(result.reelsPosition[j][i]);
      }
      result.symbolsOnScreen.push(symbolsOnRow);
    }
    //calculate every payout line based on config.lines and current symbols on screen
    for (const line of this.config.lines) {
      let linePayout = 0;
      let sameSymbolCount: { [key: number]: number } = {};
      for (let i = 1; i < this.config.reelsCount; i++) {
        const prevSymbol = result.symbolsOnScreen[line[i - 1]][i - 1];
        const symbol = result.symbolsOnScreen[line[i]][i];
        if (!sameSymbolCount[symbol] && symbol === prevSymbol) {
          sameSymbolCount[symbol] = 2;
        } else if (sameSymbolCount[symbol] && symbol === prevSymbol) {
          sameSymbolCount[symbol] += 1;
        } else {
          for (const [key, value] of Object.entries(sameSymbolCount)) {
            if (value < 3) {
              delete sameSymbolCount[Number(key)];
            }
          }
        }
      }
      for (const [key, value] of Object.entries(sameSymbolCount)) {
        if (value >= 3) {
          linePayout = this.config.symbols[Number(key)][value - 1];
        }
      }
      result.linesPayout.push(linePayout);
    }

    return result;
  }
  //method for printing the results of spinResult method
  public spin() {
    const result = this.spinResult();
    console.log("Single spin results:");
    console.log("Reels position and symbols on the screen:");
    result.symbolsOnScreen.forEach((reel) => console.log(reel));

    console.log("Lines Payout:");
    console.log("First line payout[0, 0, 0, 0, 0] -", result.linesPayout[0]);
    console.log("Second line payout[1, 1, 1, 1, 1] -", result.linesPayout[1]);
    console.log("Third line payout[2, 2, 2, 2, 2] -", result.linesPayout[2]);
    console.log("Forth line payout[0, 1, 0, 1, 0] -", result.linesPayout[3]);
    console.log("Fifth line payout[1, 2, 1, 2, 1] -", result.linesPayout[4]);
    console.log("---------------------------------------");
  }
  //method for calculating the total payout from all lines for a single slot spin
  private calculatePayout(result: {
    reelsPosition: number[][];
    symbolsOnScreen: number[][];
    linesPayout: number[];
  }): number {
    let totalPayout = 0;
    for (const payout of result.linesPayout) {
      totalPayout += payout;
    }
    return totalPayout;
  }
  //method for simulating a large amount of spins that outputs stats about the end results
  public simulateSpins(numSpins: number): {
    totalWins: number;
    totalAmountWon: number;
    totalAmountOfBets: number;
    executionTime: number;
  } {
    const startTime = Date.now();
    let totalWins = 0;
    let totalAmountWon = 0;
    let totalAmountOfBets = 0;

    for (let i = 0; i < numSpins; i++) {
      const result = this.spinResult();
      const spinPayout = this.calculatePayout(result);
      if (spinPayout) {
        totalWins++;
      }
      totalAmountWon += spinPayout;
      totalAmountOfBets += 10;
    }

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log("Simulation results for", numSpins, "spins");
    console.log("Total wins:", totalWins);
    console.log("Total amount won:", totalAmountWon);
    console.log("Total amount of bets:", totalAmountOfBets);
    console.log("Execution time (ms):", executionTime);

    return {
      totalWins,
      totalAmountWon,
      executionTime,
      totalAmountOfBets,
    };
  }
}

// Create an instance of SlotGame and roll a single spin and/or simulate a huge amount of spins
const slotGame = new SlotGame(gameConfig);
slotGame.spin();
slotGame.simulateSpins(100000);
