import {po, $, $$, Component} from '../index';

describe('import', function () {
    it('po', () => {
        console.log(po)
        expect(po.init).to.be.instanceof(Function);
        expect(po.getElement).to.be.instanceof(Function);
    });

    it('$', () => {
        expect($).to.be.instanceof(Function);
    });

    it('$$', () => {
        expect($$).to.be.instanceof(Function);
    });

    it('Component', () => {
        expect(Component).to.be.instanceof(Function);
    });
});

