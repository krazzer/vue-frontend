import {Mocker} from "@/classes/mocker";

const mocker = new Mocker(0);

console.log(mocker.dataTableMock)

describe("Pages test", () => {
    it("Edits a page", () => {
        cy.intercept({method: 'POST', url: '/api/home'}, mocker.homeMock.getDefaultHomeResponse(true));
        cy.intercept({method: 'POST', url: '/api/datatable/edit'}, mocker.dataTableMock.getEditResponse('pages'));
        cy.intercept({method: 'POST', url: '/api/translations'}, mocker.appMock.getTranslations());
        cy.intercept({method: 'POST', url: '/api/module/pages'}, mocker.homeMock.getResponseByModule('pages'));

        cy.visit("/cms/pages");
        cy.get("tr[data-id='2'] .name").dblclick();
        cy.get('input[value="Page title"]').should('be.visible');
    });
});
