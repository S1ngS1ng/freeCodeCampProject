import { PokerHand } from "../card-collection/hand-type.interface";

export type WinnerRef = 1 | 0 | -1;

export interface Result {
    botRank: PokerHand;
    playerRank: PokerHand;
    winnerRef: WinnerRef;
}

