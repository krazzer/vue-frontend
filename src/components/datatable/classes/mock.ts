import type MockAdapter from "axios-mock-adapter";

class DataTableMock {
    public defaultData = {
        buttons: [{label: 'Add client', action: 'add'}, {label: 'Delete', action: 'delete'}],
        pages: [1, null, 5, 6, 7, null, 11],
        headers: {'id': "Id", 'name': "Name", 'address': "Address", 'zip': "Zip"},
        form: {
            fields: [
                {
                    key: 'firstname',
                    type: 'text',
                    label: 'Legal first name',
                    size: {sm: 6, md: 4},
                    hint: 'example of helper text only on focus',
                    validator: {name: 'presence', parameters: {}}
                },
                {
                    key: 'middlename',
                    type: 'text',
                    label: 'Legal middle name',
                    size: {sm: 6, md: 4},
                    hint: 'example of helper text only on focus 2'
                },
                {
                    key: 'lastname',
                    type: 'text',
                    label: 'Legal last name',
                    size: {sm: 6, md: 4},
                    hint: 'example of helper text only on focus 3'
                },
                {
                    key: 'email',
                    type: 'text',
                    label: 'E-mail address',
                    validator: {name: 'email', parameters: {required: true}}
                },
                {
                    key: 'password',
                    type: 'text',
                    label: 'Password',
                },
                {
                    key: 'zip',
                    type: 'text',
                    label: 'Zip code',
                    validator: {name: 'server', parameters: {name: 'postalcode'}}
                },
                {
                    key: 'age',
                    type: 'select',
                    label: 'Age',
                    items: [
                        {key: '0-17', value: '0-17'},
                        {key: '18-29', value: '18-29'},
                        {key: '30-54', value: '30-54'},
                        {key: '54+', value: '54+'}
                    ],
                    size: {sm: 6},
                },
                {
                    key: 'interests',
                    type: 'autocomplete',
                    multiple: true,
                    label: 'Interests',
                    items: [
                        {key: '1', value: 'Skiing'},
                        {key: '2', value: 'Ice hockey'},
                        {key: '3', value: 'Soccer'},
                        {key: '4', value: 'Basketball'},
                        {key: '5', value: 'Hockey'},
                        {key: '6', value: 'Reading'},
                        {key: '7', value: 'Writing'},
                        {key: '8', value: 'Coding'},
                        {key: '9', value: 'Basejump'},
                    ],
                    size: {sm: 6},
                },
                {
                    key: 'hobbies',
                    type: 'datatable',
                    label: 'Hobbies',
                    instance: 'hobbies',
                },
            ],
        },
        data: [
            {id: 'a1', data: ['a1', 'Peter', 'Peterstreet 17', '12345']},
            {id: 'a2', data: ['a2', 'John', 'Johnstreet 17', '23456']},
            {id: 'a3', data: ['a3', 'Susan', 'Susanstreet 17', '34567']},
            {id: 'a4', data: ['a4', 'Henry', 'Henrystreet 17', '45678']},
            {id: 'a5', data: ['a5', 'Naomi', 'Naomistreet 17', '56789']},
            {id: 'a6', data: ['a6', 'Peter', 'Peterstreet 17', '12345']},
            {id: 'a7', data: ['a7', 'John', 'Johnstreet 17', '23456']},
            {id: 'a8', data: ['a8', 'Susan', 'Susanstreet 17', '34567']},
            {id: 'a9', data: ['a9', 'Henry', 'Henrystreet 17', '45678']},
            {id: 'a10', data: ['a10', 'Naomi', 'Naomistreet 17', '56789']},
            {id: 'a11', data: ['a11', 'Peter', 'Peterstreet 17', '12345']},
            {id: 'a12', data: ['a12', 'John', 'Johnstreet 17', '23456']},
            {id: 'a13', data: ['a13', 'Susan', 'Susanstreet 17', '34567']},
            {id: 'a14', data: ['a14', 'Henry', 'Henrystreet 17', '45678']},
            {id: 'a15', data: ['a15', 'Naomi', 'Naomistreet 17', '56789']},
            {id: 'a16', data: ['a16', 'Peter', 'Peterstreet 17', '12345']},
            {id: 'a17', data: ['a17', 'John', 'Johnstreet 17', '23456']},
            {id: 'a18', data: ['a18', 'Susan', 'Susanstreet 17', '34567']},
            {id: 'a19', data: ['a19', 'Henry', 'Henrystreet 17', '45678']},
            {id: 'a20', data: ['a20', 'Naomi', 'Naomistreet 17', '56789']},
            {id: 'a21', data: ['a21', 'Peter', 'Peterstreet 17', '12345']},
            {id: 'a22', data: ['a22', 'John', 'Johnstreet 17', '23456']},
            {id: 'a23', data: ['a23', 'Susan', 'Susanstreet 17', '34567']},
            {id: 'a24', data: ['a24', 'Henry', 'Henrystreet 17', '45678']},
            {id: 'a25', data: ['a25', 'Naomi', 'Naomistreet 17', '56789']},
            {id: 'a26', data: ['a26', 'Peter', 'Peterstreet 17', '12345']},
            {id: 'a27', data: ['a27', 'John', 'Johnstreet 17', '23456']},
            {id: 'a28', data: ['a28', 'Susan', 'Susanstreet 17', '34567']},
            {id: 'a29', data: ['a29', 'Henry', 'Henrystreet 17', '45678']},
            {id: 'a30', data: ['a30', 'Naomi', 'Naomistreet 17', '56789']},
            {id: 'a31', data: ['a31', 'Peter', 'Peterstreet 17', '12345']},
            {id: 'a32', data: ['a32', 'John', 'Johnstreet 17', '23456']},
            {id: 'a33', data: ['a33', 'Susan', 'Susanstreet 17', '34567']},
            {id: 'a34', data: ['a34', 'Henry', 'Henrystreet 17', '45678']},
            {id: 'a35', data: ['a35', 'Naomi', 'Naomistreet 17', '56789']},
            {id: 'a36', data: ['a36', 'Peter', 'Peterstreet 17', '12345']},
            {id: 'a37', data: ['a37', 'John', 'Johnstreet 17', '23456']},
            {id: 'a38', data: ['a38', 'Susan', 'Susanstreet 17', '34567']},
            {id: 'a39', data: ['a39', 'Henry', 'Henrystreet 17', '45678']},
            {id: 'a40', data: ['a40', 'Naomi', 'Naomistreet 17', '56789']},
        ],
        instance: 'clients',
    };

    public subDataTableData = {
        buttons: [{label: 'Add hobby', action: 'add'}, {label: 'Delete', action: 'delete'}],
        headers: ['id', 'name'],
        form: {
            fields: [
                {
                    key: 'name',
                    type: 'text',
                    label: 'Name of hobby',
                    validator: {name: 'presence', parameters: {}}
                },
            ],
        },
        data: [
            {id: 1, data: [1, 'Fitness']},
            {id: 2, data: [2, 'Gaming']},
            {id: 3, data: [3, 'Sup']},
        ],
        instance: 'test',
    };

    mock(mocker: MockAdapter) {
        mocker.onGet("/api/datatable").reply((request) => {
            let dataTableSettings = this.getDataForInstance(request.params.instance);
            let params            = {settings: dataTableSettings};

            return [200, params];
        });

        mocker.onGet("/api/datatable/edit").reply(() => {
            return [200, this.getEditData()];
        });

        mocker.onPost("/api/datatable/delete").reply((request) => {
            let params = JSON.parse(request.data).params;
            let data   = this.getDataForInstance(params.instance).data;
            let ids    = params.ids;

            ids.forEach((id: string) => {
                let index = this.getIndexById(data, id);
                data.splice(index, 1);
            });

            return [200, data];
        });

        mocker.onPost("/api/datatable/filter").reply((request) => {
            let params        = JSON.parse(request.data).params;
            let search        = params.search;
            let sort          = params.sort;
            let sortDirection = params.sortDirection;
            let config        = this.getDataForInstance(params.instance);
            let data          = structuredClone(config.data);
            let keys          = Object.keys(config.headers);
            let index         = keys.indexOf(sort);

            if (search) {
                let newData = <any>[];

                data.forEach((row: any) => {
                    for (let key in row.data) {
                        if (typeof row.data[key] !== 'string') {
                            continue;
                        }

                        if (row.data[key].toLowerCase().includes(search.toLowerCase())) {
                            newData.push(row);
                            break;
                        }
                    }
                });

                data = newData;
            }

            if(sort) {
                data.sort((a: any, b: any) => {
                    const nameA = a.data[index].toLowerCase();
                    const nameB = b.data[index].toLowerCase();

                    if (sortDirection == 'ascending') {
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                    } else {
                        if (nameA < nameB) return 1;
                        if (nameA > nameB) return -1;
                    }
                    return 0;
                });
            }

            return [200, {data: data, pages: config.pages}];
        });

        mocker.onGet("/api/datatable/save").reply((request) => {
            let newData = request.params.data;
            let id      = request.params.id;

            let index;

            let editData = this.getDataForInstance(request.params.instance).data;

            if (id) {
                index = this.getIndexById(editData, id);
            } else {
                index = parseInt(Object.keys(editData)[Object.keys(editData).length - 1]) + 1;
            }

            switch (request.params.instance) {
                case 'hobbies':
                    editData[index] = {id: id, data: [id, newData.name]};
                    break;
                case 'clients':
                    editData[index] = {id: id, data: [id, newData.firstname, newData.address, newData.zip]};
                    break;
            }

            this.getDataForInstance(request.params.instance).data = editData;

            return [200, editData];
        });

        // will not calculate the actual rearrange, not worth coding for just a mock
        mocker.onGet("/api/datatable/rearrange").reply((request) => {
            let editData = this.getDataForInstance(request.params.instance).data;

            let from = this.getIndexById(editData, request.params.source);
            let to   = this.getIndexById(editData, request.params.target);

            editData.splice(to, 0, editData.splice(from, 1)[0]);

            return [200, editData];
        });

        mocker.onPost("/api/datatable/validate").reply((request) => {
            let params         = JSON.parse(request.data).params;
            let validated: any = 'Invalid';

            if (params.name === 'postalcode') {
                validated = (/^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(params.value)) ? true : 'Invalid postal code';
            }

            return [200, validated];
        });

        mocker.onGet("/api/datatable/collapse").reply(() => {
            return [200];
        });
    }

    getContentData() {
        return {
            buttons: [{label: 'Add content', action: 'add'}, {label: 'Delete', action: 'delete'}],
            headers: ['id', 'name', 'content'],
            form: {
                fields: [
                    {
                        key: 'name',
                        type: 'text',
                        label: 'Name',
                        validator: {name: 'presence', parameters: {}}
                    },
                    {
                        key: 'content',
                        type: 'richtext',
                        label: 'Content',
                        validator: {name: 'presence', parameters: {}}
                    },
                ],
            },
            data: [
                {
                    id: 'a1',
                    data: ['content1', 'Peter', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas libero an...']
                },
                {
                    id: 'a2',
                    data: ['content2', 'John', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas libero an...']
                },
            ],
            instance: 'content',
        };
    }

    getDataForInstance(instance: string): any {
        switch (instance) {
            case 'hobbies':
                return this.getSubDataTableData();
            case 'clients':
                return this.getDefaultData();
            case 'content':
                return this.getContentData();
            case 'pages':
                return this.getPagesData();
        }
    }

    getDefaultData() {
        return this.defaultData;
    }

    getSubDataTableData() {
        return this.subDataTableData;
    }

    getPagesData() {
        let data = [
            {id: '1', level: 0, data: ['Hoofdmenu', '', '', 1], type: 'menu', max: 2, actionUrls: {preview: 'https://google.nl'}, children: true},
            {id: '2', level: 1, data: [{'label': 'Home', 'icons': ['lock']}, 'home', 'home', 2]},
            {id: '3', level: 1, data: ['About', 'default', 'about', 3]},
            {id: '4', level: 1, data: ['Prices', 'default', 'prices', 4]},
            {id: '5', level: 1, data: ['Projects', 'projects', 'projects', 5], collapsed: true, children: true},
            {id: '6', level: 2, data: ['Project A', 'project', 'project-A', 6]},
            {id: '7', level: 2, data: ['Project B', 'project', 'project-B', 7]},
            {id: '8', level: 2, data: ['Project C', 'project', 'project-C', 8]},
            {id: '9', level: 1, data: ['Contact', 'contact', 'contact', 3]},
            {id: '10', level: 0, data: ['Other pages', '', '', 10], type: 'menu', max: 1, children: true},
            {id: '11', level: 1, data: ['Other page', 'default', 'other-page', 11]},
        ];

        return {
            buttons: [
                {label: 'Add page', action: 'add', icon: 'mdi-plus'},
                {label: 'Delete', action: 'delete', icon: 'mdi-delete'},
            ],
            actions: [
                {key: 'preview', type: 'url', icon: 'mdi-eye'}
            ],
            headers: ['name', 'template', 'slug', 'id'],
            cells: {'name': {'type': 'page'}},
            pages: [1, 2, 3],
            data: data,
            languages: [
                {key: 'en', label: 'English'},
                {key: 'nl', label: 'Dutch'},
            ],
            language: 'en',
            instance: 'pages',
            class: 'pages',
            form: {
                tabs: [
                    {
                        key: 'page',
                        name: 'Page',
                        fields: [
                            {
                                key: 'title',
                                type: 'text',
                                label: 'Title',
                                validator: {name: 'presence', parameters: {}}
                            },
                            {
                                key: 'content',
                                type: 'textarea',
                                label: 'Content',
                                validator: {name: 'presence', parameters: {}}
                            },
                        ],
                    },
                    {
                        key: 'seo',
                        name: 'SEO',
                        fields: [
                            {
                                key: 'seo_title',
                                type: 'text',
                                label: 'SEO title',
                            },
                            {
                                key: 'seo_keywords',
                                type: 'textarea',
                                label: 'SEO keywords',
                            },
                            {
                                key: 'seo_description',
                                type: 'textarea',
                                label: 'SEO description',
                            },
                        ]
                    },
                    {
                        key: 'advanced',
                        name: 'Advanced',
                        fields: [
                            {
                                key: 'template',
                                type: 'select',
                                label: 'Template',
                            },
                            {
                                key: 'slug',
                                type: 'text',
                                label: 'Slug',
                            },
                            {
                                key: 'key',
                                type: 'text',
                                label: 'Key',
                            },
                            {
                                key: 'active',
                                type: 'checkbox',
                                label: 'Active',
                            },
                        ]
                    },
                ],
            },
        };
    }

    getEditData(): any {
        return {
            title: 'Page title',
            content: '<p>Some content</p><p>Second paragraph</p>',
            firstname: 'Peter',
            lastname: 'Peterson',
            middlename: 'von',
            email: 'peter@peter.com',
            password: 'somepass',
            zip: '12345',
            age: '18-29',
            interests: ["1", "2"],
            address: 'Peterstreet 17',
        };
    }

    /**
     * @param data
     * @param id
     */
    getIndexById(data: any, id: number | string): number {
        let foundIndex = 0;

        data.forEach((row: any, index: number) => {
            if (id == row.id) {
                foundIndex = index;
            }
        });

        return foundIndex;
    }
}

export default new DataTableMock();