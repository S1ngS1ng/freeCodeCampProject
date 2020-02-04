import { CardValue } from '../component/card';
import { PokerHand } from '../component/card-collection/hand-type.interface';

export class CardService {
    private static self: CardService;

    // Singleton
    public static get instance() {
        return this.self || (this.self = new this());
    };

    constructor() { }

    getResult(bot, player) {
        const botHand = this.generateHandObj(bot);
        const playerHand = this.generateHandObj(player);
        const playerRank = this.getHandType(playerHand);
        const botRank = this.getHandType(botHand);

        let result = { playerRank, botRank };

        if (playerRank !== botRank) {
            return Object.assign(result, {
                winnerRef: playerRank > botRank ? 1 : -1
            });
        }

        let index = 0;
        const playerValues = this.constructSortedValue(playerHand.value);
        const botValues = this.constructSortedValue(botHand.value);
        // Compare each card from the beginning
        while (index < playerValues.length) {
            let playerCurr = playerValues[index];
            let botCurr = botValues[index];
            if (playerCurr !== botCurr) {
                return Object.assign(result, {
                    winnerRef: this.comparator(playerCurr, botCurr)
                });
            }
            index++;
        }

        return Object.assign(result, {
            winnerRef: 0
        });
    }

    /**
     * @function constructSortedValue
     * @private
     * @desc Sort the card value array (no dupes) based on both value count (descendingly) and value point (descendingly)
     *     This array is for further comparison when two poker hands have the same rank point
     * @param {HandObj~value} valueObj - The object of cardValue => count
     * @return {CardValue[]} - The sort result
     */
    private constructSortedValue(valueCount) {
        return Object.keys(valueCount)
            .map(Number)
            .sort((a, b) => {
                if (valueCount[a] < valueCount[b]) {
                    return 1;
                } else if (valueCount[a] > valueCount[b]) {
                    return -1
                } else {
                    if (a < b) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            });
    }

    /**
     * Poker object type definition
     * @typedef {Object} HandObj
     * @property {CardValue[]} sortedValue - Poker hand values sorted by comparator, ascendingly
     * @property {Object} suit - The suit count object of the poker hand
     * @property {Object} value - The value count object of the poker hand
     */
    /**
     * @function Compare~generateHandObj
     * @private
     * @desc Sort poker hand values, calculate suit count and value count for rank determination
     * @param {Poker[]} cardList - The poker hand array to be calculated
     * @return {HandObj} - The hand object returned
     */
    private generateHandObj(cardList) {
        let valueCount = {};
        let suitCount = {};
        let sortedValue = cardList.map(card => card.value).sort(this.comparator);

        // Calculate the count of value and suit
        for (let i = 0; i < cardList.length; i++) {
            let { value, suit } = cardList[i];
            if (valueCount[value] === undefined) {
                valueCount[value] = 1;
            } else {
                valueCount[value]++;
            }

            if (suitCount[suit] === undefined) {
                suitCount[suit] = 1;
            } else {
                suitCount[suit]++;
            }
        }

        return {
            sortedValue,
            suit: suitCount,
            value: valueCount,
        };
    }

    /**
     * @function Compare~comparator
     * @private
     * @desc A wrapper of isLargerThan, where a transform function of bool => 1 or -1 has been passed in
     *     This may be used as the callback of sort function
     */
    private comparator = (a, b) => {
        return this.isLargerThan(a, b, bool => bool ? 1 : -1);
    };

    /**
     * @function Compare~isLargerThan
     * @private
     * @desc Compare two card values passed in
     * @param {CardValue} a - The card value
     * @param {CardValue} b - The card value
     * @param {Function} [transformFunc] - The transform function (boolean => any) to be applied before finalizing the result
     * @return {Boolean|any} - Comparison result:
     *     - When no transform function is passed in, return boolean
     *     - Else, it depends on the return value of the transform function
     */
    private isLargerThan(a, b, transformFunc) {
        let temp = a > b;

        if (typeof transformFunc === 'function') {
            return transformFunc(temp);
        }

        return temp;
    }

    /**
     * @function getHandType
     * @desc Calculate poker hand type
     * @param {Card[]} hand - The card array to be calculated
     * @return {PokerHand}
     */
    getHandType({ sortedValue: values, suit, value }): PokerHand {
        const isFlush = this.isFlush(suit);
        if (this.isStraight(values) && isFlush) {
            return PokerHand.StraightOrRoyalFlush;
        } else if (this.isWheel(values) && isFlush) {
            return PokerHand.SteelWheel;
        } else if (this.isWheel(values)) {
            return PokerHand.Wheel;
        } else if (this.isStraight(values)) {
            return PokerHand.Straight;
        } else if (this.isFlush(suit)) {
            return PokerHand.Flush;
        }

        let valueCount = Object.keys(value).length;
        let countArr = Object.values(value);

        if (valueCount === 2) {
            return countArr.includes(4) ? PokerHand.FourOfAKind : PokerHand.FullHouse;
        } else if (valueCount === 3) {
            return countArr.includes(3) ? PokerHand.ThreeOfAKind : PokerHand.TwoPair;
        } else if (valueCount === 4) {
            return PokerHand.OnePair;
        } else {
            return PokerHand.HighCard;
        }
    }

    /**
     * @function Compare~isWheel
     * @private
     * @desc Check if a poker hand is wheel straight
     * @param {HandObj~value} values - The object of cardValue => count
     * @return {Boolean}
     */
    private isWheel(values) {
        // This is the only case to form a wheel
        return values[0] === 2 && values[1] === 3 && values[2] === 4 &&
            values[3] === 5 && values[4] === 14;
    }

    /**
     * @function Compare~isStraight
     * @private
     * @desc Check if a poker hand is straight
     * @param {HandObj~value} values - The object of cardValue => count
     * @return {Boolean}
     */
    private isStraight(values) {
        // Determine if the first four values are ascending
        for (let i = 0; i < values.length - 1; i++) {
            if (CardValue[values[i + 1]] !== CardValue[values[i] + 1]) {
                return false;
            }
        }

        // Does not apply to (steel) wheel straight
        return values[4] === values[3] + 1;
    }

    /**
     * @function isFlush
     * @private
     * @desc Check if a poker hand is flush
     * @param {HandObj~suit} suitCount - The object of suit => count
     * @return {Boolean}
     */
    private isFlush(suitCount) {
        return Object.keys(suitCount).length === 1;
    }

}

