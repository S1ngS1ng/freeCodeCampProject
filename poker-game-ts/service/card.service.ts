import { Card } from '../component/card';
import { Hand } from '../component/card-collection/hand.model';

export class CardService {
    private hand: Hand;
    botHand: Card[];
    playerHand: Card[];

    constructor() { }

    getHands() {
        this.hand = new Hand();
    }
}
