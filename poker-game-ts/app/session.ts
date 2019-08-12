import { Deck } from '../component/card-collection/deck.model';
import { Game } from '../component/game';

export class Session {
    private static self: Session;
    deck: Deck;
    game: Game;
    user: string;
    cash: number;

    // Singleton
    public static get instance() {
        return this.self || (this.self = new this());
    };

    constructor() {
        this.user = null;
        this.cash = 0;
        this.deck = new Deck();
    }

    nextGame(bet) {
        this.game = new Game(bet, this.deck);
    }

    clear(): void {
        this.user = null;
        this.cash = 0;
    }

    init(userName: string = 'Ninja Cat'): Session {
        this.user = userName;
        this.cash = 100;

        return this;
    }

    isSessionActive(): boolean {
        return this.user !== '';
    }

    setCash(amount: number): void {
        this.cash = amount;
    }
}
