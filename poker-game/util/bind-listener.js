import { $, $all } from './query.js';
import Handler from './handler.js';
import Session from '../lib/session.js';

export default class Listener {
    constructor() {
        this.handler = new Handler();
        // TODO: bind with loop
        this.tokens = ['start'];
    }

    bind() {
        $('#start').onclick = this.handler.start;
        $('#bet-range-input').oninput = this.handler.betRangeInput;
        $('#bet-value-input').onchange = this.handler.betValueInput;
    }
}

