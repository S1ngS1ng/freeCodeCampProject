import { $ } from '../util';

export class DomService {
    private static self: DomService;

    // Singleton
    public static get instance() {
        return this.self || (this.self = new this());
    };

    constructor() { }

    /**
     * @function setContent
     * @desc Update the content (innerHTML) of each element with `id`
     * @param {ElementContent} obj - Pairs of id => content
     */
    public setContent(obj) {
        for (let id in obj) {
            $(`#${id}`).innerHTML = obj[id];
        }
    }

    /**
     * @function setAttr
     * @private
     * @desc Update the value(s) for the attribute(s) within the element of ${id}
     * @param {String} id - The id of a DOM element
     * @param {AttrValue} obj - Rest of the parameter, which are pairs of attr => value
     */
    private setAttr({ id, ...pairs }) {
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
     * @function hide
     * @desc Hide element of id
     * @param {String} id - The id of an element that should be hidden
     */
    public hide(id) {
        this.setAttr({
            id,
            style: {
                display: 'none'
            }
        });
    }

    /**
     * @function hideAll
     * @private
     * @desc Hide all elements based on the id list passed in
     * @param {...String} idList - The id(s) of the element(s) that should be hidden
     */
    hideAll(...idList) {
        for (let i = 0; i < idList.length; i++) {
            this.hide(idList[i]);
        }
    }

    /**
     * @function show
     * @private
     * @desc Show element of id
     * @param {String} id - The id of an element that should be displayed
     *     If the id is ending with 'container', set `display` to 'flex'
     */
    show(id) {
        this.setAttr({
            id,
            style: {
                display: /container$/.test(id) ? 'flex' : 'block'
            }
        });
    }

    /**
     * @function showAll
     * @private
     * @desc Show all elements based on the id list passed in
     * @param {...String} idList - The id(s) of the element(s) that should be hidden
     */
    showAll(...idList) {
        for (let i = 0; i < idList.length; i++) {
            this.show(idList[i]);
        }
    }

}
