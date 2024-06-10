import * as Cypress from 'cypress';

export function NativeSelector(selectorFunction: (cy: Cypress.cy, parent: Cypress.Chainable) => Cypress.Chainable) {
    return {
        isNativeSelector: true,
        selectorFunction
    }
}

export function Selector(selectorFunction: (arg: string) => string | Object) {
    return {
        isSelectorFunction: true,
        selectorFunction
    }
}
