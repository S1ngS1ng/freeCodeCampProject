import { $ } from './query';
import Handler from './handler';

import { ClickToken } from './util.interface';

export default class Listener {
    public clickTokens: ClickToken[];
    public handler: Handler;

    constructor() {
        this.handler = new Handler();
        this.clickTokens = ['start', 'bet', 'next', 'refill', 'end'];
    }

    bind(): void {
        this.clickTokens.forEach(token => {
            $(`#${token}`).onclick = this.handler[token];
        });
        $('#bet-range-input').oninput = this.handler.betRangeInput;
    }
}

