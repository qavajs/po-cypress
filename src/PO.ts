import parseTokens, { Token } from './parseTokens';
import { Definition } from './register';

interface anyObject {
    selector?: string;
}

interface Logger {
    log(value?: string): void;
}

const defaultLogger: Logger = {
    log() {}
};

class PO {

    driver: any = null;
    config: { timeout?: number } = {};
    logger!: Logger;

    public init(driver: any, options: { timeout?: number, logger?: Logger } = { timeout: 2000 }) {
        this.driver = driver;
        this.config.timeout = options.timeout;
        this.logger = options.logger ?? defaultLogger;
    }

    /**
     * Get element from page object
     * @public
     * @param {string} alias
     * @returns { any }
     */
    public getElement(alias: string): Cypress.Chainable {
        if (!this.driver) throw new Error('Driver is not attached. Call po.init(driver)')
        const tokens: Array<Token> = parseTokens(alias);
        let element: any = this.driver;
        let po: PO | anyObject = this;
        while (tokens.length > 0) {
            const token = tokens.shift() as Token;
            [element, po] = this.getEl(element, po, token);
        }
        const extendedElement = element as any;
        extendedElement.alias = alias;
        return extendedElement
    }

    public register(obj: Object) {
        for (const prop in obj) {
            // @ts-ignore
            this[prop] = obj[prop]
        }
    };

    /**
     * Get element by provided page object and token
     * @private
     * @param {any} element
     * @param {Object} po
     * @param {Token} token
     * @returns
     */
    private getEl(element: any, po: Object, token: Token): any {
        const elementName: string = token.elementName.replace(/\s/g, '');
        // @ts-ignore
        const newPo: Definition = po[elementName];
        if (!newPo) throw new Error(`${token.elementName} is not found`);
        const currentElement = (newPo.ignoreHierarchy ? this.driver : element) as Cypress.Chainable;
        if (newPo.isNativeSelector) return [(newPo.selectorFunction as Function)(this.driver, currentElement), newPo];
        if (!newPo.isCollection && token.suffix) throw new Error(`Unsupported operation. ${token.elementName} is not collection`);
        if (newPo.isCollection && !newPo.selector) throw new Error(`Unsupported operation. ${token.elementName} selector property is required as it is collection`);
        if (!newPo.selector) return [currentElement, newPo];
        newPo.resolvedSelector = this.resolveSelector(newPo.selector, token.param);
        this.logger.log(`${elementName} -> ${newPo.resolvedSelector}`);
        if (newPo.isCollection && token.suffix === 'in') return [
            this.getElementByText(currentElement, newPo, token),
            newPo
        ];
        if (newPo.isCollection && token.suffix === 'of') return [
             this.getElementByIndex(currentElement, newPo, token),
            newPo
        ];
        return [ this.getSingleElement(currentElement, newPo.resolvedSelector), newPo ]
    }

    /**
     * @private
     * @param {any} element - element to get
     * @param {Definition} po - page object
     * @param {Token} token - token
     * @returns
     */
    private getElementByText(element: any, po: Definition, token: Token): any {
        const tokenValue = token.value as string;
        if (token.prefix === '#') {
            return element[this.getNestingCommand(element)](po.resolvedSelector).filter(`:contains("${tokenValue}")`).first();
        }
        if (token.prefix === '@') {
            return element[this.getNestingCommand(element)](po.resolvedSelector).then((elements: any) => {
                return elements.filter((index: number, element: any) => {
                    return element.innerText === tokenValue
                })
            }).first();
        }
        if (token.prefix === '/') {
            return element[this.getNestingCommand(element)](po.resolvedSelector).then((elements: any) => {
                const regexp = new RegExp(tokenValue);
                return elements.filter((index: number, element: any) => {
                    return regexp.test(element.innerText)
                })
            }).first();
        }
        throw new Error(`${token.prefix} is not supported`)
    }

    /**
     * @private
     * @param {any} element - element to get
     * @param {Definition} po - page object
     * @param {Token} token - token
     * @returns
     */
    private getElementByIndex(element: any, po: Definition, token: Token): any {
        const index = parseInt(token.value as string) - 1;
        return element[this.getNestingCommand(element)](po.resolvedSelector).eq(index);
    }

    /**
     * @private
     * @param {any} element - element to get
     * @param {string} selector - selector
     * @returns
     */
    private getSingleElement(element: any, selector: string) {
        return element[this.getNestingCommand(element)](selector);
    }

    private getNestingCommand(element: any) {
        return element === this.driver ? 'get' : 'find';
    }

    private resolveSelector(selector: any, param?: string[]) {
        return selector.isSelectorFunction ? selector.selectorFunction(...param as string[]) : selector
    }

}

export const po = new PO();
