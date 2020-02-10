import { Card, CardValue } from "../component/card";

/**
 * @interface TemplateObject - Object that contains pairs as in id => content
 * @property {String} name - The tag name
 * @property {String|TemplateObject[]} content - The content within the tag:
 *     - For string, use as is
 *     - For TemplateObject[], construct HTML content for each item before adding in between the tag
 * @property {String} [className] - The class to be assigned
 * @property {String} [idName] - The id to be assigned
 */
interface TemplateObject {
    name: string;
    content: string | TemplateObject[];
    className?: string;
    idName?: string;
}

/**
 * @class ComposeContent
 * @desc The module to be used for creating HTML content
 */
export class ComposeContent {
    private static self: ComposeContent;
    private suitArr = ['♠️', '♥️', '♣️', '♦️'];

    // Singleton
    public static get instance() {
        return this.self || (this.self = new this());
    };

    constructor() { }

    /**
     * @function card
     * @public
     * @desc Generate partial template for displaying cards
     * @param {Card[]} cardList - The poker hand
     * @return {String} - The HTML content of the poker hand to be rendered
     */
    card(cardList: Card[]) {
        return this.tag({
            name: 'div',
            className: 'poker-hand-result',
            content: cardList.map(card => ({
                name: 'div',
                className: 'poker-hand-result-item',
                content: [{
                    name: 'div',
                    className: 'poker-hand-card-front',
                    content: [{
                        name: 'div',
                        className: 'poker-hand-card-value-top',
                        content: this.getPoint(card.value)
                    }, {
                        name: 'div',
                        className: 'poker-hand-card-suit',
                        content: this.suitArr[card.suit]
                    }, {
                        name: 'div',
                        className: 'poker-hand-card-value-bottom',
                        content: this.getPoint(card.value)
                    }]
                }, {
                    name: 'div',
                    className: 'poker-hand-card-back',
                    content: ''
                }]
            }))
        });
    }

    /**
     * @function getPoint
     * @private
     * @param {Number} value - The card value to be converted
     * @return {String} The string representation of the card value, which is from '2' - '10' and 'J' to 'A'
     */
    private getPoint(value: CardValue): string {
        const royal = ['J', 'Q', 'K', 'A'];

        if (value > 10) {
            return royal[value - 11];
        }

        return `${value}`;
    }

    /**
     * @function tag
     * @private
     * @desc Generate the HTML content based on the given parameters
     * @param {TemplateObject} - The template object to be used
     * @return {String} - The HTML string to be rendered
     */
    private tag({
        className,
        content,
        name,
        idName = ''
    }: TemplateObject): string {
        // Construct attribute string
        let attributes = this.attr({
            class: className,
            id: idName
        });

        // Recursive call when the content is of type TemplateObject[]
        if (Array.isArray(content)) {
            return `<${name}${attributes}>${content.map(e => this.tag(e)).join('')}</${name}>`
        }

        return `<${name}${attributes}>${content}</${name}>`;
    }

    /**
     * @function attr
     * @private
     * @desc Transform the HTML {attribute => value} object to string, which is to be used when composing the HTML content
     *     Return empty string when value is empty
     * @param {Object} obj - Pairs of HTML attribute => value that to be applied to the HTML element
     * @return {String} - The attribute string to be used
     */
    private attr(obj): string {
        return Object.keys(obj).map(key => obj[key] && ` ${key}="${obj[key]}"`).join('');
    }
}
