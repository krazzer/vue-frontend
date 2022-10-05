// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
    it("visits the app root url", () => {
        cy.intercept({
            method: 'GET',
            url: '/api/home',
        }, {loggedIn:false})
            .as('NotLoggedIn') // and assign an alias

        cy.visit("/cms");
        cy.get(".login").should('be.visible');
    });
});
