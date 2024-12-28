import loginMock from "@/components/login/classes/mock";
import dataTableMock from "@/components/datatable/classes/mock";
import type MockAdapter from "axios-mock-adapter";

class HomeMock {
    mock(mocker: MockAdapter) {
        this.mockHomeReply(mocker);

        let moduleRegExp = new RegExp('/api/module/*');

        let clientsDataTable = dataTableMock.getDefaultData();
        let pagesDataTable   = dataTableMock.getPagesData();
        let contentDataTable = dataTableMock.getContentData();

        mocker.onPost(moduleRegExp).reply((requestConfig) => {
            let module = this.getModuleName(requestConfig.url);
            let params = {html: module, selectedMenuItem: ''};

            if (module == 'error') {
                return [400];
            }

            let paramsFor: any = {
                'clients': {dataTable: clientsDataTable},
                'pages': {dataTable: pagesDataTable},
                'content': {dataTable: contentDataTable},
                '': {dataTable: pagesDataTable},
                'media': {media: {files: this.getMediaFiles()}},
                'settings': {form: this.getSettingsForm()},
                'invoices': {component: 'Invoices'},
                'revenue': {component: 'Revenue'},
                'users': {component: 'subfolder/Sub'},
            };

            Object.keys(paramsFor).forEach(key => {
                if (module == key) {
                    params = paramsFor[key];
                }
            });

            return [200, params];
        });

        mocker.onPost("/api/default-module").reply(() => {
            let params = {html: '', selectedMenuItem: '', dataTable: pagesDataTable};

            return [200, params];
        });

        mocker.onPost("/api/logout").reply(() => {
            localStorage.loggedIn = JSON.stringify(false);
            loginMock.loggedIn    = false;
            return [200];
        });
    }

    getMediaFiles() {
        return [
            {id: 1, name: 'Folder with an exceptionally long name that will probably not fit', isDir: true},
            {id: 2, name: 'Folderwithanexceptionallylongnameandhasnospacesaswell', isDir: true},
            {id: 3, name: 'Folder with key', isDir: true, key: 'somekey'}, {id: 4, name: 'Folder', isDir: true},
            {id: 5, name: 'Folder', isDir: true}, {id: 6, name: 'Folder', isDir: true},
            {id: 7, name: 'Folder', isDir: true}, {id: 8, name: 'Folder', isDir: true},
            {id: 9, name: 'Folder', isDir: true}, {id: 10, name: 'Folder', isDir: true},
            {
                id: 11,
                name: 'Image 1',
                isDir: false,
                thumb: '/cms/src/assets/images/example-image-1.jpg',
                url: '/cms/src/assets/images/example-image-1.jpg'
            },
            {
                id: 12,
                name: 'Image 2',
                isDir: false,
                thumb: '/cms/src/assets/images/example-image-2.jpg',
                url: '/cms/src/assets/images/example-image-2.jpg'
            },
        ];
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
                            label: 'Another open field (required)',
                            validator: {name: 'presence', parameters: {}}
                        },
                    ],
                    save: true,
                },
            ],
            data: {},
            instance: 'settings'
        };
    }

    mockHomeReply(mocker: MockAdapter) {
        mocker.onPost("/api/home").reply(() => {
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
                pages: {label: "Pages", icon: 'view-grid'},
                media: {label: "Media", icon: 'image-outline'},
                clients: {label: "Clients", icon: 'account-multiple-outline'},
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
                visitors: {label: "Visitors", icon: 'google-analytics'},
                users: {label: "Users", icon: 'account-multiple-outline'},
                content: {label: "Content", icon: 'view-grid'},
                settings: {label: "Settings"},
            },
            html: 'pages',
            selectedMenuItem: 'pages',
            role: 'developer',
        }
    }
}

export default new HomeMock();