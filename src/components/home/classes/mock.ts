import {Mocker} from "@/classes/mocker";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import loginMock from "@/components/login/classes/mock";

class HomeMock extends Mocker {
    addMock() {
        let mock = new MockAdapter(axios, {delayResponse: 50});

        mock.onGet("/api/home").reply(() => {
            return [200, {
                loggedIn: loginMock.loggedIn,
                menu: {
                    pages: {label: "Pages", icon: 'pages'},
                    media: {label: "Media", icon: 'media'},
                    clients: {
                        label: "Clients",
                        icon: 'users'
                    },
                    invoices: {
                        label: "Invoices",
                        icon: '<svg width="80" height="80"><rect width="80" height="80" fill="red" /></svg>',
                        submenu: {
                            invoices: {
                                label: "Invoices",
                                icon: '<svg width="80" height="80"><rect width="80" height="80" fill="red" /></svg>',
                            },
                            revenue: {
                                label: "Revenue",
                                icon: '<svg height="80" width="80"><circle cx="50%" cy="50%" r="50%" fill="red"></circle></svg>',
                            },
                        }
                    },
                    visitors: {label: "Visitors", icon: 'stats'},
                    users: {label: "Users", icon: 'users'},
                    settings: {label: "Settings"},
                },
                html: 'pages',
                selectedMenuItem: 'pages',
            }];
        });

        let moduleRegExp = new RegExp('/api/module/*');

        mock.onGet(moduleRegExp).reply((requestConfig) => {
            let module = String(requestConfig.url).split('/').pop();
            let params = {html: module, selectedMenuItem: ''};

            if(module == ''){
                params.selectedMenuItem = 'pages';
            }

            return [200, params];
        });

        mock.onGet("/api/logout").reply(() => {
            localStorage.loggedIn = JSON.stringify(false);
            loginMock.loggedIn = false;
            return [200];
        });
    }
}

export default new HomeMock();