// querySelector applies to both HTMLElement (e.g. p tag) and HTMLInputElement (e.g. input tag), hence the &
export const $ = (query: string): HTMLElement & HTMLInputElement => document.querySelector(query);
export const $all = (query: string): NodeListOf<Element> => document.querySelectorAll(query);

