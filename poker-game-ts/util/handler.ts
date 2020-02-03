import { $ } from './query';
import { ComposeContent } from './compose-content';
import { Deck } from "../component/card-collection/deck.model";
import { Session } from '../app/session';
import { MaterialSliderElement } from './handler.interface';
import { DomService } from "../service/dom.service";

/**
 * @class Handler
 * @desc The module that contains all event handler
 */
export class Handler {
    private static self: Handler;
    public composeContent: ComposeContent;
    public rankMap: Object;
    private session: Session;
    private deck: Deck;
    private dom: DomService;

    // Singleton
    public static get instance() {
        return this.self || (this.self = new this());
    };

    constructor() {
        this.composeContent = ComposeContent.instance;
        this.dom = DomService.instance;
        this.deck = Deck.instance;
        this.session = Session.instance;

        this.rankMap = {
            1: 'high card',
            2: 'a pair',
            3: 'two pairs',
            4: 'three of a kind',
            5: 'a straight',
            6: 'a flush',
            7: 'a full house',
            8: 'four of a kind',
            9: 'a straight flush/royal flush'
        };

        this.dom.hideAll('cash-container', 'bet-container', 'result-container', 'result-rank-container');
    }

    /**
     * @function Handler~start
     * @desc Click handler of the #start button
     */
    start() {
        this.dom.showAll('bet-container', 'cash-container');
        this.dom.hideAll('welcome-container', 'result-container');

        let userName = $('#user-name-input').value || 'Ninja Cat';
        let betRangeInputRef = $('#bet-range-input') as MaterialSliderElement;

        // Check if there is an on-going session
        // Create one if not
        if (!this.session.isActive()) {
            this.session = this.session.init(userName);
        }

        // Set name and cash
        this.dom.setContent({
            cash: this.session.cash,
            'user-name': userName
        });

        // "Two-way binding" of both (slider and text) input
        // See: https://getmdl.io/components/index.html#sliders-section
        betRangeInputRef.MaterialSlider.change(+Math.ceil(this.session.cash / 4));
        this.dom.setAttr({
            id: 'bet-range-input',
            max: this.session.cash
        });

        this.dom.setContent({
            'bet-value-input-val': +Math.ceil(this.session.cash / 4)
        });
    }

    /**
     * @function Handler~bet
     * @desc Click handler of the #bet button
     */
    bet() {
        this.dom.show('result-container');
        this.dom.hideAll('bet-container', 'result-text-container', 'action-container', 'result-rank-container', 'bot-rank', 'player-rank');

        let betValue = +$('#bet-range-input').value;
        this.dom.setContent({ 'bet-in-result': betValue });

        this.session.nextGame(betValue);
    }

    /**
     * @function Handler~refill
     * @desc Click handler of the #refill button, add $100 to cash
     */
    refill() {
        this.session.cash += 100;
        this.start();
    }

    /**
     * @function Handler~next
     * @desc Click handler of the #next button
     */
    next() {
        this.dom.hide('result-container');
        this.start();
    }

    /**
     * @function Handler~end
     * @desc Click handler of the #end button
     */
    end() {
        this.dom.hideAll('cash-container', 'bet-container', 'result-container');
        this.dom.setContent({
            'user-name': ''
        });
        this.dom.setAttr({
            id: 'user-name-input',
            value: ''
        });
        this.dom.show('welcome-container');

        this.session.clear();
        // Reset the deck for the new session later on
        this.deck.reset();
    }

    /**
     * @function Handler~betRangeInput
     * @desc Input handler of the #bet-range-input slider
     * @param {Object} e - The event object
     */
    betRangeInput = e => {
        this.dom.setContent({
            'bet-value-input-val': +e.target.value
        });
    };
}
