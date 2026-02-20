import type MockAdapter from "axios-mock-adapter";
import MockSorter from "./mockSorter";
import {appUtil} from "@/classes/AppUtil";

// Define an interface instead of importing Mocker to avoid circular dependency
interface MockerInterface {
    dataTableMock: any;
}

class DataTableMock {
    appMocker: MockerInterface;

    public appUtil = appUtil;

    public filterItems = [
        {key: '1', title: 'Category 1'}, {key: '2', title: 'Category 2'},
        {key: '3', title: 'Category 3'}, {key: '4', title: 'Category 4'},
    ];

    public defaultData = {
        buttons: [{label: 'Add client', action: 'add'}, {label: 'Delete', action: 'delete'}],
        filters: [
            {key: 'category', label: 'Category', multiple: false, items: this.filterItems},
            {key: 'categories', label: 'Categories', multiple: true, width: 300, items: this.filterItems}
        ],
        pages: [1, null, 5, 6, 7, null, 11],
        headers: {'id': "Id", 'name': "Name", 'address': "Address", 'zip': "Zip", 'category': "Category"},
        mobileColumns: ['id', 'name'],
        data: [
            {id: 'a1', data: ['a1', 'Peter', 'Peterstreet 17', '12345', 1]},
            {id: 'a2', data: ['a2', 'John', 'Johnstreet 17', '23456', 2]},
            {id: 'a3', data: ['a3', 'Susan', 'Susanstreet 17', '34567', 3]},
            {id: 'a4', data: ['a4', 'Henry', 'Henrystreet 17', '45678', 4]},
            {id: 'a5', data: ['a5', 'Naomi', 'Naomistreet 17', '56789', 1]},
            {id: 'a6', data: ['a6', 'Peter', 'Peterstreet 17', '12345', 2]},
            {id: 'a7', data: ['a7', 'John', 'Johnstreet 17', '23456', 3]},
            {id: 'a8', data: ['a8', 'Susan', 'Susanstreet 17', '34567', 4]},
            {id: 'a9', data: ['a9', 'Henry', 'Henrystreet 17', '45678', 1]},
            {id: 'a10', data: ['a10', 'Naomi', 'Naomistreet 17', '56789', 2]},
            {id: 'a11', data: ['a11', 'Peter', 'Peterstreet 17', '12345', 3]},
            {id: 'a12', data: ['a12', 'John', 'Johnstreet 17', '23456', 4]},
            {id: 'a13', data: ['a13', 'Susan', 'Susanstreet 17', '34567', 1]},
            {id: 'a14', data: ['a14', 'Henry', 'Henrystreet 17', '45678', 2]},
            {id: 'a15', data: ['a15', 'Naomi', 'Naomistreet 17', '56789', 3]},
            {id: 'a16', data: ['a16', 'Peter', 'Peterstreet 17', '12345', 4]},
            {id: 'a17', data: ['a17', 'John', 'Johnstreet 17', '23456', 1]},
            {id: 'a18', data: ['a18', 'Susan', 'Susanstreet 17', '34567', 2]},
            {id: 'a19', data: ['a19', 'Henry', 'Henrystreet 17', '45678', 3]},
            {id: 'a20', data: ['a20', 'Naomi', 'Naomistreet 17', '56789', 4]},
            {id: 'a21', data: ['a21', 'Peter', 'Peterstreet 17', '12345', 1]},
            {id: 'a22', data: ['a22', 'John', 'Johnstreet 17', '23456', 2]},
            {id: 'a23', data: ['a23', 'Susan', 'Susanstreet 17', '34567', 3]},
            {id: 'a24', data: ['a24', 'Henry', 'Henrystreet 17', '45678', 4]},
            {id: 'a25', data: ['a25', 'Naomi', 'Naomistreet 17', '56789', 1]},
            {id: 'a26', data: ['a26', 'Peter', 'Peterstreet 17', '12345', 2]},
            {id: 'a27', data: ['a27', 'John', 'Johnstreet 17', '23456', 3]},
            {id: 'a28', data: ['a28', 'Susan', 'Susanstreet 17', '34567', 4]},
            {id: 'a29', data: ['a29', 'Henry', 'Henrystreet 17', '45678', 1]},
            {id: 'a30', data: ['a30', 'Naomi', 'Naomistreet 17', '56789', 2]},
            {id: 'a31', data: ['a31', 'Peter', 'Peterstreet 17', '12345', 3]},
            {id: 'a32', data: ['a32', 'John', 'Johnstreet 17', '23456', 4]},
            {id: 'a33', data: ['a33', 'Susan', 'Susanstreet 17', '34567', 1]},
            {id: 'a34', data: ['a34', 'Henry', 'Henrystreet 17', '45678', 2]},
            {id: 'a35', data: ['a35', 'Naomi', 'Naomistreet 17', '56789', 3]},
            {id: 'a36', data: ['a36', 'Peter', 'Peterstreet 17', '12345', 4]},
            {id: 'a37', data: ['a37', 'John', 'Johnstreet 17', '23456', 1]},
            {id: 'a38', data: ['a38', 'Susan', 'Susanstreet 17', '34567', 2]},
            {id: 'a39', data: ['a39', 'Henry', 'Henrystreet 17', '45678', 3]},
            {id: 'a40', data: ['a40', 'Naomi', 'Naomistreet 17', '56789', 4]},
        ],
        instance: 'clients',
    };

    public subDataTableData = {
        buttons: [{label: 'Add hobby', action: 'add'}, {label: 'Delete', action: 'delete'}],
        headers: {'id': "Id", 'name': 'Name'},
        mobileColumns: ['id', 'name'],
        actions: [
            {key: 'rearrange', type: 'rearrange', icon: 'mdi-drag-horizontal-variant'}
        ],
        data: [
            {id: 1, data: [1, 'Fitness']},
            {id: 2, data: [2, 'Gaming']},
            {id: 3, data: [3, 'Sup']},
        ],
        instance: 'test',
        search: false,
    };

    public defaultForm = {
        fields: {
            group1: {
                type: 'group',
                size: {md: 6},
                fields: {
                    firstname: {
                        type: 'text',
                        label: 'Legal first name',
                        size: {sm: 6, md: 4},
                        hint: 'example of helper text only on focus',
                        validator: {name: 'presence', parameters: {}}
                    },
                    middlename: {
                        type: 'text',
                        label: 'Legal middle name',
                        size: {sm: 6, md: 4},
                        hint: 'example of helper text only on focus 2'
                    },
                    lastname: {
                        type: 'text',
                        label: 'Legal last name',
                        size: {sm: 6, md: 4},
                        hint: 'example of helper text only on focus 3'
                    },
                    email: {
                        type: 'text',
                        label: 'E-mail address',
                        validator: {name: 'email', parameters: {required: true}}
                    },
                    password: {
                        type: 'text',
                        label: 'Password',
                    },
                }
            },
            group2: {
                type: 'group',
                size: {md: 6},
                fields: {
                    zip: {
                        type: 'text',
                        label: 'Zip code',
                        validator: {name: 'server', parameters: {name: 'postalcode'}}
                    },
                    age: {
                        type: 'select',
                        label: 'Age',
                        items: {
                            '0-17': '0-17',
                            '18-29': '18-29',
                            '30-54': '30-54',
                            '54+': '54+',
                        },
                        size: {sm: 6},
                    },
                    interests: {
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
                },
            },
            hobbies: {
                type: 'datatable',
                label: 'Hobbies',
                instance: 'hobbies',
                settings: this.subDataTableData,
            },
        },
    };

    public subDataTableForm = {
        fields: {
            name: {
                type: 'text',
                label: 'Name of hobby',
                validator: {name: 'presence', parameters: {}}
            },
        },
    };

    public contentForm = {
        fields: {
            name: {
                type: 'text',
                label: 'Name',
                validator: {name: 'presence', parameters: {}}
            },
            date: {
                type: 'date',
                label: 'Date',
            },
            content: {
                type: 'richtext',
                label: 'Content',
                validator: {name: 'presence', parameters: {}}
            },
            file: {
                type: 'filepicker',
                label: 'File',
                validator: {name: 'presence', parameters: {}}
            },
            label: {
                type: 'label',
                label: 'Label',
                content: "Just some <u>HTML</u> content",
            },
        },
    };

    public linkForm = {
        fields: {
            name: {
                type: 'text',
                label: 'Link name',
                validator: {name: 'presence', parameters: {}}
            },
        },
    }

    public pagesForm = {
        tabs: [
            {
                key: 'page',
                name: 'Page',
                fields: {
                    title: {
                        type: 'text',
                        label: 'Title',
                        validator: {name: 'presence', parameters: {}}
                    },
                    content: {
                        type: 'textarea',
                        label: 'Content',
                        validator: {name: 'presence', parameters: {}}
                    },
                    type: {
                        type: 'hidden',
                    },
                },
            },
            {
                key: 'seo',
                name: 'SEO',
                fields: {
                    seo_title: {
                        type: 'text',
                        label: 'SEO title',
                    },
                    seo_keywords: {
                        type: 'textarea',
                        label: 'SEO keywords',
                    },
                    seo_description: {
                        type: 'textarea',
                        label: 'SEO description',
                    },
                }
            },
            {
                key: 'advanced',
                name: 'Advanced',
                fields: {
                    template: {
                        type: 'select',
                        label: 'Template',
                        items: {
                            'default': 'Default',
                            'home': 'Home',
                        },
                    },
                    slug: {
                        type: 'text',
                        label: 'Slug',
                    },
                    key: {
                        type: 'text',
                        label: 'Key',
                    },
                    active: {
                        type: 'checkbox',
                        label: 'Active',
                    },
                }
            },
        ],
    };

    public forms: any = {
        'hobbies': this.subDataTableForm,
        'clients': this.defaultForm,
        'content': this.contentForm,
        'pages': this.pagesForm,
    };

    mock(mocker: MockAdapter) {
        mocker.onPost("/api/datatable").reply((request) => {
            let params    = JSON.parse(request.data);
            let dataTable = this.getDataForInstance(params.instance);

            return [200, dataTable];
        });

        mocker.onPost("/api/datatable/edit").reply((request) => {
            let instance = JSON.parse(request.data).instance;

            return [200, this.getEditResponse(instance)];
        });

        mocker.onPost("/api/datatable/add").reply((request) => {
            let params   = JSON.parse(request.data);
            let instance = params.instance;
            let form     = this.forms[instance];

            if (params.type == 'link') {
                form = this.linkForm;
            }

            return [200, {form: form}];
        });

        mocker.onPost("/api/datatable/delete").reply((request) => {
            let params = JSON.parse(request.data);
            let data   = this.getDataForInstance(params.instance).data;
            let ids    = params.ids;

            ids.forEach((id: number) => {
                let index = this.appUtil.getIndexById(data, id);
                data.splice(index, 1);
            });

            return [200, {data: data}];
        });

        mocker.onPost("/api/datatable/filter").reply((request) => {
            let params        = JSON.parse(request.data);
            let search        = params.search;
            let sort          = params.sort;
            let sortDirection = params.sortDirection;
            let filters       = params.filters;
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

            if (sort) {
                data.sort((a: any, b: any) => MockSorter.sort(a, b, index, sortDirection));
            }

            if (filters && (filters.category || filters.categories)) {
                data = data.filter((item: any) => {
                    if (filters.category && item.data[4] != filters.category) {
                        return false;
                    }

                    if (filters.categories) {
                        if (filters.categories.length == 0) {
                            return true;
                        } else {
                            return filters.categories.includes(item.data[4] + '');
                        }
                    }

                    return true;
                });
            }

            return [200, {data: data, pages: config.pages}];
        });

        mocker.onPost("/api/datatable/save").reply((request) => {
            let params  = JSON.parse(request.data);
            let newData = params.formData;
            let id      = params.id;

            let index;

            let editData = this.getDataForInstance(params.instance).data;

            if (id) {
                index = this.appUtil.getIndexById(editData, id);
            } else {
                index = parseInt(<string>Object.keys(editData)[Object.keys(editData).length - 1]) + 1;
            }

            switch (params.instance) {
                case 'hobbies':
                    editData[index] = {id: id, data: [id, newData.name]};
                    break;
                case 'clients':
                    editData[index] = {id: id, data: [id, newData.firstname, newData.address, newData.zip]};
                    break;
            }

            this.getDataForInstance(params.instance).data = editData;

            editData[index].data[3] = false;

            return [200, {data: editData, id: id}];
        });

        // will not calculate the actual rearranging, not worth coding for just a mock
        let rearrangeAction = (request: any) => {
            let params   = JSON.parse(request.data);
            let editData = this.getDataForInstance(params.instance).data;

            let from = this.appUtil.getIndexById(editData, params.source);
            let to   = this.appUtil.getIndexById(editData, params.target);

            editData.splice(to, 0, editData.splice(from, 1)[0]);

            return [200, editData];
        };

        mocker.onPost("/api/datatable/page/rearrange").reply(<any>rearrangeAction);
        mocker.onPost("/api/datatable/rearrange").reply(<any>rearrangeAction);

        mocker.onPost("/api/datatable/validate").reply((request) => {
            let params         = JSON.parse(request.data);
            let validated: any = 'Invalid';

            if (params.name === 'postalcode') {
                validated = (/^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(params.value)) ? true : 'Invalid postal code';
            }

            return [200, validated];
        });

        mocker.onPost("/api/datatable/collapse").reply(() => {
            return [200];
        });

        mocker.onPost("/api/datatable/check").reply(() => {
            return [200];
        });

        mocker.onPost("/api/custom-action").reply((request: any) => {
            let params = JSON.parse(request.data);

            return [200, {message: 'Custom action done for: ' + params.selected.join(','), open: "https://google.com"}];
        });
    }

    getContentData() {
        return {
            settings: {
                buttons: [{label: 'Add content', action: 'add'}, {label: 'Delete', action: 'delete'}],
                headers: {'id': 'Id', 'name': "Name", 'image': "Image", 'content': "Content"},
                cells: {'image': {'type': 'image'}},
                mobileColumns: ['id', 'name'],
                instance: 'content',
            },
            data: [
                {
                    id: 'a1',
                    data: ['content1', 'Peter', '/cms/src/assets/images/example-image-1.jpg',
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas libero an...']
                },
                {
                    id: 'a2',
                    data: ['content2', 'John', '/cms/src/assets/images/example-image-2.jpg',
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas libero an...']
                },
            ],
        };
    }

    getDataForInstance(instance: string): any {
        let dataTable = null;

        switch (instance) {
            case 'hobbies':
                dataTable = this.getSubDataTableData();
                break;
            case 'clients':
                dataTable = this.getDefaultData();
                break;
            case 'content':
                dataTable = this.getContentData();
                break;
            case 'pages':
                dataTable = this.getPagesData();
                break;
        }

        if (!dataTable) {
            return null;
        }

        return {settings: dataTable, data: dataTable.data};
    }

    getDefaultData() {
        return {settings: this.defaultData, data: this.defaultData.data};
    }

    getEditResponse(instance: string): any {
        let helperData = {file: {thumb: '/cms/src/assets/images/example-image-1.jpg'}};

        return {
            form: this.forms[instance],
            data: this.getEditData(),
            helperData: helperData
        };
    }

    getSubDataTableData() {
        return this.subDataTableData;
    }

    getPagesData() {
        let data = [
            {
                id: '1',
                level: 0,
                data: ['Hoofdmenu', '', '', true, 1],
                type: 'menu',
                max: 2,
                actionUrls: {preview: 'https://google.nl'},
                children: true
            },
            {id: '2', level: 1, data: [{'label': 'Home', 'icons': ['lock']}, 'home', 'home', true, 2]},
            {id: '3', level: 1, data: ['About', 'default', 'about', true, 3]},
            {id: '4', level: 1, data: ['Prices', 'default', 'prices', true, 4]},
            {id: '5', level: 1, data: ['Projects', 'projects', 'projects', true, 5], collapsed: true, children: true},
            {id: '6', level: 2, data: ['Project A', 'project', 'project-A', true, 6]},
            {id: '7', level: 2, data: ['Project B', 'project', 'project-B', true, 7]},
            {id: '8', level: 2, data: ['Project C', 'project', 'project-C', true, 8]},
            {id: '9', level: 1, data: ['Contact', 'contact', 'contact', true, 9]},
            {id: '10', level: 0, data: ['Other pages', '', '', true, 10], type: 'menu', max: 1, children: true},
            {id: '11', level: 1, data: ['Other page with a long name', 'default', 'other-page', false, 11]},
        ];

        return {
            settings: {
                buttons: [
                    {label: 'Add page', action: 'add', icon: 'mdi-plus'},
                    {label: 'Delete', action: 'delete', icon: 'mdi-delete'},
                    {
                        label: 'Add new…', icon: 'mdi-menu', type: 'menu', items: [
                            {title: 'Add link', icon: 'mdi-link-variant', action: 'add', addType: 'link'},
                            {title: 'Add menu', icon: 'mdi-menu', action: 'add', addType: 'menu'}
                        ]
                    },
                    {
                        label: 'Custom action',
                        action: 'action',
                        actionRoute: 'custom-action',
                        actionConfirm: 'Are you sure?'
                    },
                    {
                        label: 'Page count: #12',
                        type: 'label',
                        icon: 'mdi-view-grid'
                    },
                ],
                actions: [
                    {key: 'preview', type: 'url', icon: 'mdi-eye'}
                ],
                headers: {name: "Name", template: "Template", slug: "Slug", active: "Active", id: "Id"},
                mobileColumns: ['name'],
                cells: {name: {type: 'page'}, active: {type: 'checkbox'}},
                pages: [1, 2, 3],
                data: data,
                languages: [
                    {key: 'en', label: 'English'},
                    {key: 'nl', label: 'Dutch'},
                ],
                language: 'en',
                instance: 'pages',
                class: 'pages',
                search: true,
            },
            data: data
        };
    }

    getEditData(): any {
        return {
            title: 'Page title',
            name: 'Some name',
            content: '<p>Some content</p><p>Second paragraph</p>',
            firstname: 'Peter',
            lastname: 'Peterson',
            middlename: 'von',
            email: 'peter@peter.com',
            password: 'somepass',
            zip: '12345',
            age: '18-29',
            interests: ["1", "2"],
            file: [11],
            address: 'Peterstreet 17',
        };
    }
}

export default new DataTableMock();
