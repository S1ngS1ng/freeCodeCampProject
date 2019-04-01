import { $, $all } from './query.js';
// TODO: Alert panel
// import { setError } from '../lib/alert-panel.js';
import Session from '../lib/session.js';
import Generate from '../lib/generate.js';
import Compare from '../lib/compare.js';

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
        this.generate = new Generate();
        this.compare = new Compare();
    }

    /**
     * @function Handler~start
     * @desc Click handler of the #start button
     */
    start = () => {
        // Show bet container
        this._setAttr({
            id: 'bet-container',
            style: {
                display: 'block'
            }
        });

        let userName = $('#user-name-input').value;

        if (this.session) {
            setError({
                user: this.session.user,
                cash: this.session.cash
            });

            return;
        }

        this.session = new Session(userName);

        // Set name and cash
        this._setContent({
            cash: this.session.cash,
            'user-name': userName
        });

        // "Two-way binding" of both (slider and text) input
        this._setAttr({
            id: 'bet-range-input',
            value: 1,
            max: this.session.cash
        });
        this._setAttr({
            id: 'bet-value-input',
            value: 1
        });

        // Hide welcome container
        this._setAttr({
            id: 'welcome-container',
            style: {
                display: 'none'
            }
        });
    }

    /**
     * @function Handler~bet
     * @desc Click handler of the #bet button
     */
    bet = () => {
        // Show result container
        this._setAttr({
            id: 'result-container',
            style: {
                display: 'block'
            }
        });

        let bet = $('#bet-value-input').value;

        // Hide bet container
        this._setAttr({
            id: 'bet-container',
            style: {
                display: 'none'
            }
        })

        this._setContent({ 'bet-in-result': bet });

        let playerHand = this.generate.hand();
        let botHand = this.generate.hand();

        console.log(playerHand, botHand);
        console.log(this.compare.isPlayerWinning(playerHand, botHand));
    }

    /**
     * @function Handler~next
     * @desc Click handler of the #next button
     */
    next = () => {

    }

    /**
     * @function Handler~end
     * @desc Click handler of the #end button
     */
    end = () => {

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
     * @function Handler~_setContent
     * @private
     * @param {ElementContent} obj - Pairs of id => content
     * @desc Update the content (innerHTML) of each element with `id`
     */
    _setContent(obj) {
        for (let id in obj) {
            $(`#${id}`).innerHTML = obj[id];
        }
    }

    /**
     * @function Handler~_setAttr
     * @private
     * @param {String} id - The id of a DOM element
     * @param {AttrValue} obj - Rest of the parameter, which are pairs of attr => value
     * @desc Update the value(s) for the attribute(s) within the element of ${id}
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
}

