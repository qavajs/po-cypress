import { resolve } from 'path';
import po from '../src/PO';
import samplePO from './samplePO';
import { $ } from '../src/register';

describe('po', function () {
    beforeEach(() => {
        po.init(cy, { timeout: 5000 });
        po.register(samplePO);
        const fileName = resolve('./tests/test_page.html');
        cy.visit(fileName);
    });

    it('get single element', () => {
        const element = po.getElement('Single Element');
        element.should('have.text', 'text of single element');
    });

    it('get collection', () => {
        const collection = po.getElement('List');
        collection.should('have.length', 6)
    });

    it('get element from collection by index', () => {
        const element = po.getElement('#2 of List');
        element.should('have.text', 'Second');
    });

    it('get element from collection by partial text', () => {
        const element = po.getElement('#Thi in List');
        element.should('have.text', 'Third');
    });

    // it('get element from collection by exact text', () => {
    //     const element = po.getElement('@Third in List');
    //     element.should('have.text', 'Third');
    // });
    //
    // it('get element from collection by regexp text', () => {
    //     const element = po.getElement('/Thi/ in List');
    //     element.should('have.text', 'Third');
    // });

    it('get element from component', () => {
        const element = po.getElement('Single Component > Child Item');
        element.should('have.text', 'text of first child item');
    });

    it('get element from multiple component item by index', () => {
        const element = po.getElement('#2 of Multiple Components > ChildItem');
        element.should('have.text', 'second inner');
    });

    it('get element from multiple component item by partials text', () => {
        const element = po.getElement('#second in Multiple Components > Child Item');
        element.should('have.text', 'second inner');
    });

    // it('get element from multiple component item by exact text', () => {
    //     const element = po.getElement('@third inner in Multiple Components > Child Item');
    //     element.should('have.text', 'second inner');
    // });

    it('get child item of each element of collection', () => {
        const collection = po.getElement('Multiple Components > Child Item');
        collection.should('have.length', 3);
        collection.eq(0).should('have.text', 'first inner');
    });

    it('get element from collection by partial text containing in', () => {
        const element = po.getElement('#Contain in in List');
        element.should('have.text', 'Contain in word');
    });


    it('get element from collection', () => {
        const element = po.getElement('Async Component > #2 of Child Items');
        element.should('have.text', 'async 2');
    });


    it('ignore hierarchy flag', () => {
        const element = po.getElement('Single Component > Ignore Hierarchy Item');
        element.should('have.text', 'first inner');
    });

    it('get element from component without selector', () => {
        const element = po.getElement('Component Without Selector > Single Element');
        element.should('have.text', 'text of single element');
    });

    it('get element from collection from component without selector', () => {
        const element = po.getElement('Component Without Selector > #2 of List');
        element.should('have.text', 'Second');
    });

})

