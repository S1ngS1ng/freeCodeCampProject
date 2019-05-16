/**
 * Object that contains pairs as in id => content
 * @interface {Object} TemplateObject
 * @property {String} name - The tag name
 * @property {String|TemplateObject[]} content - The content within the tag:
 *     - For string, use as is
 *     - For TemplateObject[], construct HTML content for each item before adding in between the tag
 * @property {String} [className] - The class to be assigned
 * @property {String} [idName] - The id to be assigned
 */
export interface TemplateObject {
    name: string;
    content: string | TemplateObject[];
    className?: string;
    idName?: string;
}

/**
 * @interface AttributeMap
 * @property {String} [id]
 * @property {String} [class]
 */
export interface AttributeMap {
    id?: string;
    class?: string;
}


