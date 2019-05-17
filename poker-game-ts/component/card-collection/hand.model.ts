import { CardPile } from './card-pile.model';
import { Card } from '../card';
import { Deck } from './deck.model';

export class Hand extends CardPile {
    private deck: Deck = Deck.instance;
    player: Card[];
    bot: Card[];

    /**
     * @override
     */
    constructor() {
        super();
        this.generateHands();
    }

    generateHands() {
        this.player = this.deck.createCardHand(5);
        this.bot = this.deck.createCardHand(5);
    }

    get handResult() {

    }
}

