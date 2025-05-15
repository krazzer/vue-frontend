import {Mocker} from "@/classes/mocker";

const mocker = new Mocker();

let notLoggedInInterception = () => {
    cy.intercept({method: 'POST', url: '/api/home',}, {loggedIn:false});
    cy.intercept({method: 'POST', url: '/api/translations'}, mocker.appMock.getTranslations());
}

describe("Login test", () => {
    it("Visits the app root url", () => {
        notLoggedInInterception();

        cy.visit("/cms");
        cy.get(".login").should('be.visible');
    });

    it("Logs in", () => {
        notLoggedInInterception();

        cy.intercept({method: 'POST', url: '/api/login'}, {success:true});

        cy.visit("/cms");
        cy.get('form [name=email]').type('test@test.com', {delay: 0});
        cy.get('form [name=password]').type('test', {delay: 0});

        cy.intercept({method: 'POST', url: '/api/home'}, mocker.homeMock.getDefaultHomeResponse(true));

        cy.get('form').submit();
    });
});
