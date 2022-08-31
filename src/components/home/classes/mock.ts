import {Mocker} from "@/classes/mocker";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import loginMock from "@/components/login/classes/mock";

class HomeMock extends Mocker {
    addMock() {
        let mock = new MockAdapter(axios, {delayResponse: 50});

        mock.onGet("/api/home").reply(() => {
            return [200, {loggedIn: loginMock.loggedIn}];
        });

        mock.onGet("/api/logout").reply(() => {
            localStorage.loggedIn = JSON.stringify(false);
            loginMock.loggedIn = false;
            return [200];
        });

        mock.onGet("/api/menu").reply(() => {
            return [200, {
                pages: {label: "Pagina's"},
                media: {label: "Media"},
                clients: {
                    label: "Clients",
                    icon: '<svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" /></svg>'
                },
                invoices: {
                    label: "Facturen",
                    icon: '<svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" /></svg>',
                    submenu: {
                        invoices: {
                            label: "Facturen",
                            icon: '<svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" /></svg>',
                        },
                        revenue: {
                            label: "Omzet",
                            icon: '<svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" /></svg>',
                        },
                    }
                },
                visitors: {label: "Bezoekers"},
                users: {label: "Gebruikers"},
                settings: {label: "Instellingen"},
                logout: {label: "Uitloggen"},
            }];
        });
    }
}

export default new HomeMock();