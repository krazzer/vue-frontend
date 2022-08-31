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
                    icon: 'users'
                },
                invoices: {
                    label: "Facturen",
                    icon: '<svg width="80" height="80"><rect width="80" height="80" fill="red" /></svg>',
                    submenu: {
                        invoices: {
                            label: "Facturen",
                            icon: '<svg width="80" height="80"><rect width="80" height="80" fill="red" /></svg>',
                        },
                        revenue: {
                            label: "Omzet",
                            icon: '<svg height="80" width="80"><circle cx="80" cy="80" r="80" fill="red" /></svg>',
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