import { AttributeMap, TemplateObject } from './compose-html.interface'

export class ComposeHtml {
    private static self: ComposeHtml;
    private readonly suitIcon = {
        S: '♠️',
        H: '♥️',
        C: '♣️',
        D: '♦️'
    };

    constructor() { }

    // Singleton
    public static get instance() {
        return this.self || (this.self = new this());
    };

    card(cardList) {
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
                        content: card.value
                    }, {
                        name: 'div',
                        className: 'poker-hand-card-suit',
                        content: this.suitIcon[card.suit]
                    }, {
                        name: 'div',
                        className: 'poker-hand-card-value-bottom',
                        content: card.value
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
     * @function tag
     * @private
     * @desc Generate the HTML content based on the given parameters
     * @param {TemplateObject} - The template object to be used
     * @return {String} - The HTML content
     */
    private tag({ name, content, className = '', idName = '' }: TemplateObject): string {
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
     * @desc Transform the HTML attribute => value object to string, which is to be used when composing the HTML content
     *     Return empty string when value is empty
     * @param {Object} obj - Pairs of HTML attribute => value
     * @return {String} - The attribute string to be used
     */
    private attr(obj: AttributeMap): string {
        return Object.keys(obj).map(key => obj[key] && ` ${key}="${obj[key]}"`).join('');
    }
}
