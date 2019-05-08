export type NormalValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type RoyalValue = 'J' | 'Q' | 'K' | 'A';
export type Suit = 'Spade' | 'Heart' | 'Club' | 'Diamond';
export type Value = NormalValue & RoyalValue;

export enum CardSuit {
    Spade = '♠️',
    Heart = '♥️',
    Club = '♣️',
    Diamond = '♦️'
}

