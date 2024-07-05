import loginMock from "@/components/login/classes/mock";
import dataTableMock from "@/components/datatable/classes/mock";
import type MockAdapter from "axios-mock-adapter";

class HomeMock {
    mock(mocker: MockAdapter) {
        this.mockHomeReply(mocker);

        let moduleRegExp = new RegExp('/api/module/*');

        let clientsDataTable = dataTableMock.getDefaultData();
        let pagesDataTable   = dataTableMock.getPagesData();

        let mediaFiles = [
            {name: 'Folder', isDir: true}, {name: 'Folder', isDir: true}, {name: 'Folder', isDir: true},
            {name: 'Folder', isDir: true}, {name: 'Folder', isDir: true}, {name: 'Folder', isDir: true},
            {name: 'Folder', isDir: true}, {name: 'Folder', isDir: true}, {name: 'Folder', isDir: true},
            {name: 'Folder', isDir: true}, {name: 'Folder', isDir: true}, {name: 'Folder', isDir: true},
        ];

        mocker.onGet(moduleRegExp).reply((requestConfig) => {
            let module = this.getModuleName(requestConfig.url);
            let params = {html: module, selectedMenuItem: ''};

            if (module == 'error') {
                return [400];
            }

            let paramsFor: any = {
                'clients': {dataTable: clientsDataTable},
                'pages': {dataTable: pagesDataTable},
                '': {dataTable: pagesDataTable},
                'media': {media: {files: mediaFiles}},
                'settings': {form: this.getSettingsForm()},
            };

            Object.keys(paramsFor).forEach(key => {
                if (module == key) {
                    params = paramsFor[key];
                }
            });

            return [200, params];
        });

        mocker.onGet("/api/default-module").reply(() => {
            let params = {html: '', selectedMenuItem: '', dataTable: pagesDataTable};

            return [200, params];
        });

        mocker.onGet("/api/logout").reply(() => {
            localStorage.loggedIn = JSON.stringify(false);
            loginMock.loggedIn    = false;
            return [200];
        });
    }

    /**
     * @param url
     */
    getModuleName(url: any) {
        return String(url).split('/').pop();
    }

    /**
     * @returns object
     */
    getSettingsForm() {
        return {
            tabs: [
                {
                    key: 'general',
                    name: 'General',
                    fields: [
                        {
                            key: 'darkmode',
                            type: 'select',
                            items: [
                                {key: 'default', value: 'System'},
                                {key: 'light', value: 'Light'},
                                {key: 'dark', value: 'Dark'},
                            ],
                            label: 'Darkmode',
                            special: 'darkModeSelect',
                        }
                    ],
                },
                {
                    key: 'advanced',
                    name: 'Advanced',
                    fields: [
                        {
                            key: 'field',
                            type: 'text',
                            label: 'Open field',
                        },
                        {
                            key: 'field2',
                            type: 'text',
                            label: 'Another open field',
                        },
                    ]
                },
            ],
            data: {}
        };
    }

    mockHomeReply(mocker: MockAdapter) {
        mocker.onGet("/api/home").reply(() => {
            return [200, this.getDefaultHomeResponse(loginMock.loggedIn)];
        });
    }

    /**
     * @param loggedIn
     */
    getDefaultHomeResponse(loggedIn: boolean): any {
        return {
            loggedIn: loggedIn,
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
        }
    }
}

export default new HomeMock();