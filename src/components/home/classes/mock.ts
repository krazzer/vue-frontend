import {Mocker} from "@/classes/mocker";
import loginMock from "@/components/login/classes/mock";
import dataTableMock from "@/components/datatable/classes/mock";
import type MockAdapter from "axios-mock-adapter";

class HomeMock extends Mocker {
    addMock(mocker: MockAdapter) {
        mocker.onGet("/api/home").reply(() => {
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

        let clientsDataTable = dataTableMock.getDefaultData();

        mocker.onGet(moduleRegExp).reply((requestConfig) => {
            let module = this.getModuleName(requestConfig.url);
            let params;

            if (module == 'clients') {
                params = {html: '', selectedMenuItem: '', dataTable: clientsDataTable};
            } else {
                params = {html: module, selectedMenuItem: ''};
            }

            if (module == '') {
                params.selectedMenuItem = 'pages';
            }

            return [200, params];
        });

        mocker.onGet("/api/logout").reply(() => {
            localStorage.loggedIn = JSON.stringify(false);
            loginMock.loggedIn = false;
            return [200];
        });
    }

    /**
     * @param url
     */
    getModuleName(url: any) {
        return String(url).split('/').pop();
    }
}

export default new HomeMock();