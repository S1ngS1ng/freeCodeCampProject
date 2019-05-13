import { CardInterface } from './card.interface';
import { CardSuit, CardValue } from './card.constant'

export class Card implements CardInterface {
    readonly suit: CardSuit;
    readonly value: CardValue;

    constructor({ suit, value }: CardInterface) {
        this.suit = suit;
        this.value = value;
    }
}

