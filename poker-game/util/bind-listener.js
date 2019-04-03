import { $, $all } from './query.js';
import Handler from './handler.js';
import Session from '../lib/session.js';

export default class Listener {
    constructor() {
        this.handler = new Handler();
        this.clickTokens = ['start', 'bet', 'next', 'refill', 'end'];
    }

    bind() {
        this.clickTokens.forEach(token => {
            $(`#${token}`).onclick = this.handler[token];
        });
        $('#bet-range-input').oninput = this.handler.betRangeInput;
        $('#bet-value-input').onchange = this.handler.betValueInput;
    }
}

