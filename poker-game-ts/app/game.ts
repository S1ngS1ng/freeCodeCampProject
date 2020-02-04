import { Card } from '../component/card';
import { Deck } from '../component/card-collection/deck.model';
import { Session } from "./session";
import { DomService } from "../service/dom.service";
import { CardService } from '../service/card.service';
import { PokerHand } from "../component/card-collection/hand-type.interface";
import { $all, ComposeContent } from "../util";

type WinnerRef = 1 | 0 | -1;

interface Result {
    botRank: PokerHand;
    playerRank: PokerHand;
    winnerRef: WinnerRef;
}

export class Game {
    botHand: Card[];
    playerHand: Card[];
    card: CardService;
    session: Session = Session.instance;
    composeContent: ComposeContent = ComposeContent.instance;
    private dom: DomService;
    private result: Result;

    constructor(
        private bet: number,
        private deck: Deck
    ) {
        this.card = CardService.instance;
        this.dom = DomService.instance;
        this.botHand = this.deck.createCardHand(5);
        this.playerHand = this.deck.createCardHand(5);
        this.result = this.card.getResult(this.botHand, this.playerHand);
        this.showResult(this.result);
        this.dom.setContent({
            'bot-result': this.composeContent.card(this.botHand),
            'player-result': this.composeContent.card(this.playerHand),
        });
        this.showCard();
    };

    /**
     * @function showResult
     * @private
     * @desc Set content while result container is hidden. Reveal result and update cash after 5 seconds
     */
    private showResult({ botRank, playerRank, winnerRef }: Result) {
        this.dom.setContent({
            ...this.getContent(winnerRef, this.bet),
            'bot-rank': `The bot has ${this.getHandType(botRank)}.`,
            'player-rank': `Your have ${this.getHandType(playerRank)}.`
        });
        this.updateCash(winnerRef);

        setTimeout(() => {
            this.dom.showAll('result-rank-container', 'bot-rank');
        }, 2500);

        setTimeout(() => {
            this.dom.showAll('player-rank', 'result-text-container');
            this.dom.setContent({
                cash: this.session.cash
            });
        }, 5000);
    }

    private getHandType(rank) {
        const handType = ['high card', 'a pair', 'two pairs', 'three of a kind',
            'a wheel', 'a straight', 'a flush', 'a full house', 'four of a kind',
            'a steel wheel', 'a straight flush/royal flush'];
        return handType[rank];
    }

    private getContent(winnerRef: WinnerRef, bet: number) {
        let result = {
            'winner-text': '',
            'cash-result': ''
        };

        if (winnerRef === 0) {
            result['winner-text'] = `😉 It's a Draw!`;
        } else if (winnerRef === 1) {
            result['winner-text'] = `😄 You're the winner! Yay!`;
            result['cash-result'] = `🤑 You won $${bet}!`;
        } else {
            result['winner-text'] = `😒 The bot won! Darn it!`;
            result['cash-result'] = `💸 You lost $${bet}!`;
        }

        return result;
    }

    private updateCash(winnerRef: WinnerRef) {
        const currentCash = this.session.cash;
        if (winnerRef === 1) {
            this.session.setCash(currentCash + this.bet);
        } else if (winnerRef === -1) {
            this.session.setCash(currentCash - this.bet);
        }

        this.checkBalance(this.session.cash);
    }

    private showCard() {
        const cards = $all('.poker-hand-result-item');

        cards.forEach((card, index) => {
            this.rotate(card, index * 500);
        });
    }

    /**
     * @function rotate
     * @private
     * @param {Object} item - The DOM ref of a card
     * @param {Number} timeout - The timeout to be set
     * @desc Add rotateY transform to card, excuted after the given time period
     */
    private rotate(item, timeout) {
        setTimeout(() => {
            item.style.transform = 'translateX(-100%) rotateY(180deg)';
        }, timeout);
    }

    /**
     * @function checkBalance
     * @private
     * @desc Check the remaining cash, determine which action button to display after 5 seconds
     */
    private checkBalance(cash) {
        if (cash > 0) {
            this.dom.hide('refill');
            this.dom.show('next');
        } else {
            setTimeout(() => {
                this.dom.hide('next');
                this.dom.show('refill');
            }, 5000);
        }
        setTimeout(() => {
            this.dom.show('action-container');
        }, 5000);
    }

}
