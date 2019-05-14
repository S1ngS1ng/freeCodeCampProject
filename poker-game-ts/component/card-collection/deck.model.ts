import { CardPile } from './card-pile.model';
import { CardSuit, CardValue } from '../card';
import { Card } from '../card';
import { Cache } from './deck.interface';
import { InitialCache } from './deck.constant';

export class Deck extends CardPile {
    cache: Cache = InitialCache;
    count: number = 0;

    constructor() {
        super();
    };

    createCardHand(amount): Card[] {
        let cards: Card[] = [];

        while (amount > 0) {
            let card: Card = this.generateRandom();
            let { suit, value } = card;

            this.count++;
            this.cache[suit].push(value);
            cards.push(card);
            amount--;
        }

        if (this.count >= 30) {
            this.reset();
        }

        return cards;
    }

    private generateRandom(): Card {
        let suit: CardSuit;
        let value: CardValue;

        do {
            suit = this.getRandomElement<CardSuit>(this.suits);
            value = this.getRandomElement<CardValue>(this.values);
        } while (this.cache[suit].includes(value));

        return new Card({ suit, value })
    }

    private getRandomElement<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private reset() {
        this.cache = InitialCache;
        this.count = 0;
    }
}
