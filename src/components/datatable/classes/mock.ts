import type MockAdapter from "axios-mock-adapter";

class DataTableMock {
    mock(mocker: MockAdapter) {
        let clientsDataTable = this.getDefaultData();

        mocker.onGet("/api/datatable").reply(() => {
            let params = {settings: clientsDataTable};
            return [200, params];
        });

        mocker.onGet("/api/datatable/edit").reply(() => {
            return [200, this.getEditData()];
        });

        mocker.onPost("/api/datatable/validate").reply((request) => {
            let params         = JSON.parse(request.data).params;
            let validated: any = 'Invalid';

            if (params.name === 'postalcode') {
                validated = (/^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(params.value)) ? true : 'Invalid postal code';
            }

            return [200, validated];
        });
    }

    getDefaultData() {
        return {
            addButtonLabel: 'Add client',
            headers: ['id', 'name', 'address', 'zip'],
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
                        type: 'password',
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
                    },
                ],
            },
            data: [
                [1, 'Peter', 'Peterstreet 17', '12345'],
                [2, 'John', 'Johnstreet 17', '23456'],
                [3, 'Susan', 'Susanstreet 17', '34567'],
                [4, 'Henry', 'Henrystreet 17', '45678'],
                [5, 'Naomi', 'Naomistreet 17', '56789'],
                [6, 'Peter', 'Peterstreet 17', '12345'],
                [7, 'John', 'Johnstreet 17', '23456'],
                [8, 'Susan', 'Susanstreet 17', '34567'],
                [9, 'Henry', 'Henrystreet 17', '45678'],
                [10, 'Naomi', 'Naomistreet 17', '56789'],
                [11, 'Peter', 'Peterstreet 17', '12345'],
                [12, 'John', 'Johnstreet 17', '23456'],
                [13, 'Susan', 'Susanstreet 17', '34567'],
                [14, 'Henry', 'Henrystreet 17', '45678'],
                [15, 'Naomi', 'Naomistreet 17', '56789'],
                [16, 'Peter', 'Peterstreet 17', '12345'],
                [17, 'John', 'Johnstreet 17', '23456'],
                [18, 'Susan', 'Susanstreet 17', '34567'],
                [19, 'Henry', 'Henrystreet 17', '45678'],
                [20, 'Naomi', 'Naomistreet 17', '56789'],
                [21, 'Peter', 'Peterstreet 17', '12345'],
                [22, 'John', 'Johnstreet 17', '23456'],
                [23, 'Susan', 'Susanstreet 17', '34567'],
                [24, 'Henry', 'Henrystreet 17', '45678'],
                [25, 'Naomi', 'Naomistreet 17', '56789'],
                [26, 'Peter', 'Peterstreet 17', '12345'],
                [27, 'John', 'Johnstreet 17', '23456'],
                [28, 'Susan', 'Susanstreet 17', '34567'],
                [29, 'Henry', 'Henrystreet 17', '45678'],
                [30, 'Naomi', 'Naomistreet 17', '56789'],
                [31, 'Peter', 'Peterstreet 17', '12345'],
                [32, 'John', 'Johnstreet 17', '23456'],
                [33, 'Susan', 'Susanstreet 17', '34567'],
                [34, 'Henry', 'Henrystreet 17', '45678'],
                [35, 'Naomi', 'Naomistreet 17', '56789'],
                [36, 'Peter', 'Peterstreet 17', '12345'],
                [37, 'John', 'Johnstreet 17', '23456'],
                [38, 'Susan', 'Susanstreet 17', '34567'],
                [39, 'Henry', 'Henrystreet 17', '45678'],
                [40, 'Naomi', 'Naomistreet 17', '56789'],

            ],
            instance: 'test',
        };
    }

    getPagesData() {
        return {
            addButtonLabel: 'Add page',
            headers: ['id', 'name', 'template', 'slug'],
            cells: {
                'name': {'type': 'page'}
            },
            data: [
                [1, {'label': 'Home', 'icons': ['lock']}, 'home', 'home'],
                [2, 'About', 'default', 'about'],
                [4, 'Prices', 'default', 'prices'],
                [5, 'Projects', 'projects', 'projects'],
                [3, 'Contact', 'contact', 'contact'],
            ],
            instance: 'pagesTest',
            class: 'pages',
        };
    }

    getEditData() {
        return {
            'firstname': 'Peter',
            'lastname': 'Peterson',
            'middlename': 'von',
            'email': 'peter@peter.com',
            'password': 'somepass',
            'zip': '12345',
            'age': '18-29',
            'interests': ["1", "2"],
        };
    }
}

export default new DataTableMock();