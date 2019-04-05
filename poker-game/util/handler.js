import { $, $all } from './query.js';
import Session from '../lib/session.js';
import Generate from '../lib/generate.js';
import Compare from '../lib/compare.js';
import ComposeContent from './compose-content.js';

/**
 * Object that contains pairs as in id => content
 * @typedef {Object} ElementContent
 * @property {String} ${id} - The content to be updated on the element of ${id}
 */
/**
 * Object that contains pairs as in attribute => value of a DOM element
 * @typedef {Object} AttrValue
 * @property {String} ${attr} - The value(s) to be updated for the attribute(s) of a given DOM element
 * @property {AttrValue} [style] - The style attribute and value that to be applied on a given DOM element
 */

/**
 * @module Handler
 * @desc The module that contains all event handler
 */
export default class Handler {
    constructor() {
        this.session = null;
        this.Session = Session;
        this.generate = new Generate();
        this.compare = new Compare();
        this.composeContent = new ComposeContent();

        this._hideAll(['cash-container', 'bet-container', 'result-container']);
    }

    /**
     * @function Handler~start
     * @desc Click handler of the #start button
     */
    start = () => {
        this._show('bet-container');
        this._hide('result-container');

        let userName = $('#user-name-input').value || 'Ninja Cat';

        // Check if there is an on-going session
        // Create one if not
        if (!this.session) {
            this.session = new this.Session(userName);
        }

        this._show('cash-container');
        // Set name and cash
        this._setContent({
            cash: this.session.cash,
            'user-name': userName
        });

        // "Two-way binding" of both (slider and text) input
        this._setAttr({
            id: 'bet-range-input',
            value: Math.ceil(this.session.cash / 4),
            max: this.session.cash
        });
        this._setAttr({
            id: 'bet-value-input',
            value: Math.ceil(this.session.cash / 4),
        });

        this._hide('welcome-container')
    }

    /**
     * @function Handler~bet
     * @desc Click handler of the #bet button
     */
    bet = () => {
        this._show('result-container');

        let betValue = +$('#bet-value-input').value;

        this._hide('bet-container');
        this._setContent({ 'bet-in-result': betValue });

        let playerHand = this.generate.hand();
        let botHand = this.generate.hand();
        let winnerRef = this.compare.isPlayerWinning(playerHand, botHand);

        this._setContent({
            'bot-result': this.composeContent.card(botHand, 'bot'),
            'player-result': this.composeContent.card(playerHand, 'player')
        });

        if (winnerRef === 0) {
            this._setContent({
                'winner-text': `Draw!`
            });
        } else {
            let userWin = winnerRef > 0;

            // Update winner info and calculate cash
            if (userWin) {
                this.session.cash += betValue;
                this._setContent({
                    'winner-text': `😄 The winner is you! Yay!`,
                    'cash-result': `🤑 You won $${betValue}!`
                });
            } else {
                this.session.cash -= betValue;
                this._setContent({
                    'winner-text': `😒 The winner is the bot! Darn it!`,
                    'cash-result': `💸 You lost $${betValue}!`
                });
            }

            this._setContent({ cash: this.session.cash });
            this._checkBalance(this.session.cash);
        }
    }

    /**
     * @function Handler~refill
     * @desc Click handler of the #refill button, add $100 to cash
     */
    refill = () => {
        this.session.cash += 100;
        this.start();
    }

    /**
     * @function Handler~next
     * @desc Click handler of the #next button
     */
    next = () => {
        this._hide('result-container');
        this.start();
    }

    /**
     * @function Handler~end
     * @desc Click handler of the #end button
     */
    end = () => {
        this._hideAll(['cash-container', 'bet-container', 'result-container']);
        this._setContent({
            'user-name': ''
        });
        this._setAttr({
            id: 'user-name-input',
            value: 'Ninja Cat'
        });
        this._show('welcome-container')
        this.session = null;
    }

    /**
     * @function Handler~betRangeInput
     * @desc Input handler of the #bet-range-input slider
     * @param {Object} e - The event object
     */
    betRangeInput = e => {
        this._setAttr({
            id: 'bet-value-input',
            value: e.target.value
        });
    }

    /**
     * @function Handler~betValueInput
     * @desc Change handler of the #bet-value-input textbox
     * @param {Object} e - The event object
     */
    betValueInput = e => {
        this._setAttr({
            id: 'bet-range-input',
            value: e.target.value
        });
    }

    /**
     * @function Handler~_checkBalance
     * @private
     * @desc Check the remaining cash, determine which action button to display
     */
    _checkBalance(cash) {
        if (cash > 0) {
            this._hide('refill');
            this._show('next');
        } else {
            this._hide('next');
            this._show('refill');
        }
    }

    /**
     * @function Handler~_setContent
     * @private
     * @desc Update the content (innerHTML) of each element with `id`
     * @param {ElementContent} obj - Pairs of id => content
     */
    _setContent(obj) {
        for (let id in obj) {
            $(`#${id}`).innerHTML = obj[id];
        }
    }

    /**
     * @function Handler~_setAttr
     * @private
     * @desc Update the value(s) for the attribute(s) within the element of ${id}
     * @param {String} id - The id of a DOM element
     * @param {AttrValue} obj - Rest of the parameter, which are pairs of attr => value
     */
    _setAttr({ id, ...pairs }) {
        let ref = $(`#${id}`);
        for (let attr in pairs) {
            if (attr === 'style') {
                let styleObj = pairs.style;
                for (let styleAttr in styleObj) {
                    ref.style[styleAttr] = styleObj[styleAttr];
                }
            } else {
                ref[attr] = pairs[attr];
            }
        }
    }

    /**
     * @function Handler~_hide
     * @private
     * @desc Hide element of id
     * @param {String} id - The id of an element that should be hidden
     */
    _hide(id) {
        this._setAttr({
            id,
            style: {
                display: 'none'
            }
        });
    }

    /**
     * @function Handler~_hideAll
     * @private
     * @desc Hide all elements based on the id list passed in
     * @param {String[]} idList - The id(s) of the element(s) that should be hidden
     */
    _hideAll(idList) {
        for (let i = 0; i < idList.length; i++) {
            this._setAttr({
                id: idList[i],
                style: {
                    display: 'none'
                }
            });
        }
    }

    /**
     * @function Handler~_show
     * @private
     * @desc Show element of id
     * @param {String} id - The id of an element that should be displayed
     *     If the id is ending with 'container', set `display` to 'flex'
     */
    _show(id) {
        this._setAttr({
            id,
            style: {
                display: /container$/.test(id) ? 'flex' : 'block'
            }
        });
    }
}

