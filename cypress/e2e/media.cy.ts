import {Mocker} from "@/classes/mocker";

const mocker = new Mocker(0);

console.log(mocker.dataTableMock)

describe("Media test", () => {
    it("Open media module", () => {
        cy.intercept({method: 'POST', url: '/api/home'}, mocker.homeMock.getDefaultHomeResponse(true));
        cy.intercept({method: 'POST', url: '/api/translations'}, mocker.appMock.getTranslations());
        cy.intercept({method: 'POST', url: '/api/module/media'}, mocker.homeMock.getResponseByModule('media'));

        cy.visit("/cms/media");
        cy.get('.media__files').should('be.visible');
    });
});
