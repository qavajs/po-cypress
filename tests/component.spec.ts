import { Component } from '../src/Component';

describe('component', function () {
    it('extend class', () => {
        class CustomComponent extends Component {}
        const customComponentInstance = new CustomComponent('.selector');
        //@ts-ignore
        expect(customComponentInstance.selector).to.equal('.selector');
    });
})

