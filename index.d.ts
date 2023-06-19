declare function $(selector: string|Object, options?: { ignoreHierarchy: boolean }): Object;
declare function $$(selector: string|Object, options?: { ignoreHierarchy: boolean }): Object;
declare type PageObject = {
    init(driver, options: { timeout: number }): void;
    register(pageObject: Object): void;
    getElement(path: string): any
}
declare let po: PageObject;
declare class Component {
    constructor(selector?: string | object)
}
declare module '@qavajs/po-cypress' {
    export { $, $$, po, Component }
}
