import { Cache } from './deck.interface'
import { CardSuit } from '../card';

export const InitialCache: Cache = {
    [CardSuit.Spade]: [],
    [CardSuit.Heart]: [],
    [CardSuit.Club]: [],
    [CardSuit.Diamond]: []
};
