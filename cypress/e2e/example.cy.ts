import {Mocker} from "@/classes/mocker";

const mocker = new Mocker();

describe("My First Test", () => {
    it("Visits the app root url", () => {
        cy.intercept({method: 'GET', url: '/api/home',}, {loggedIn:false}).as('NotLoggedIn')

        cy.visit("/cms");
        cy.get(".login").should('be.visible');
    });

    it("Logs in", () => {
        cy.intercept({method: 'GET', url: '/api/home',}, {loggedIn:false}).as('NotLoggedIn')
        cy.intercept({method: 'POST', url: '/api/login',}, {success:true}).as('LoggedIn')

        cy.visit("/cms");
        cy.get('form [name=email]').type('test@test.com', {delay: 0});
        cy.get('form [name=password]').type('test', {delay: 0});

        cy.intercept({method: 'GET', url: '/api/home'}, mocker.homeMock.getDefaultHomeResponse(true));

        cy.get('form').submit();
    });
});
