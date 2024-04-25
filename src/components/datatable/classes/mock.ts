import type MockAdapter from "axios-mock-adapter";

class DataTableMock {
    public defaultData = {
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
        data: {
            1: [1, 'Peter', 'Peterstreet 17', '12345'],
            2: [2, 'John', 'Johnstreet 17', '23456'],
            3: [3, 'Susan', 'Susanstreet 17', '34567'],
            4: [4, 'Henry', 'Henrystreet 17', '45678'],
            5: [5, 'Naomi', 'Naomistreet 17', '56789'],
            6: [6, 'Peter', 'Peterstreet 17', '12345'],
            7: [7, 'John', 'Johnstreet 17', '23456'],
            8: [8, 'Susan', 'Susanstreet 17', '34567'],
            9: [9, 'Henry', 'Henrystreet 17', '45678'],
            10: [10, 'Naomi', 'Naomistreet 17', '56789'],
            11: [11, 'Peter', 'Peterstreet 17', '12345'],
            12: [12, 'John', 'Johnstreet 17', '23456'],
            13: [13, 'Susan', 'Susanstreet 17', '34567'],
            14: [14, 'Henry', 'Henrystreet 17', '45678'],
            15: [15, 'Naomi', 'Naomistreet 17', '56789'],
            16: [16, 'Peter', 'Peterstreet 17', '12345'],
            17: [17, 'John', 'Johnstreet 17', '23456'],
            18: [18, 'Susan', 'Susanstreet 17', '34567'],
            19: [19, 'Henry', 'Henrystreet 17', '45678'],
            20: [20, 'Naomi', 'Naomistreet 17', '56789'],
            21: [21, 'Peter', 'Peterstreet 17', '12345'],
            22: [22, 'John', 'Johnstreet 17', '23456'],
            23: [23, 'Susan', 'Susanstreet 17', '34567'],
            24: [24, 'Henry', 'Henrystreet 17', '45678'],
            25: [25, 'Naomi', 'Naomistreet 17', '56789'],
            26: [26, 'Peter', 'Peterstreet 17', '12345'],
            27: [27, 'John', 'Johnstreet 17', '23456'],
            28: [28, 'Susan', 'Susanstreet 17', '34567'],
            29: [29, 'Henry', 'Henrystreet 17', '45678'],
            30: [30, 'Naomi', 'Naomistreet 17', '56789'],
            31: [31, 'Peter', 'Peterstreet 17', '12345'],
            32: [32, 'John', 'Johnstreet 17', '23456'],
            33: [33, 'Susan', 'Susanstreet 17', '34567'],
            34: [34, 'Henry', 'Henrystreet 17', '45678'],
            35: [35, 'Naomi', 'Naomistreet 17', '56789'],
            36: [36, 'Peter', 'Peterstreet 17', '12345'],
            37: [37, 'John', 'Johnstreet 17', '23456'],
            38: [38, 'Susan', 'Susanstreet 17', '34567'],
            39: [39, 'Henry', 'Henrystreet 17', '45678'],
            40: [40, 'Naomi', 'Naomistreet 17', '56789'],
        },
        instance: 'clients',
    };

    public subDataTableData = {
        addButtonLabel: 'Add hobby',
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
        data: {
            1: [1, 'Fitness'],
            2: [2, 'Gaming'],
            3: [3, 'Sup']
        },
        instance: 'test',
    };

    mock(mocker: MockAdapter) {
        mocker.onGet("/api/datatable").reply((request) => {

            let dataTableSettings = this.getDataForInstance(request.params.instance);

            let params = {settings: dataTableSettings};

            return [200, params];
        });

        mocker.onGet("/api/datatable/edit").reply(() => {
            return [200, this.getEditData()];
        });

        mocker.onGet("/api/datatable/save").reply((request) => {
            let newData = request.params.data;
            let id      = request.params.id;

            let editData = this.getDataForInstance(request.params.instance).data;

            if( ! id){
                id = parseInt(Object.keys(editData)[Object.keys(editData).length - 1]) + 1;
            }

            switch (request.params.instance){
                case 'hobbies':
                    editData[id] = [id, newData.name];
                break;
                case 'clients':
                    editData[id] = [id, newData.firstname, newData.address, newData.zip];
                break;
            }

            this.getDataForInstance(request.params.instance).data = editData;

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
    }

    getDataForInstance(instance: string): any {
        switch (instance){
            case 'hobbies':
                return this.getSubDataTableData();
            case 'clients':
                return this.getDefaultData();
        }
    }

    getDefaultData() {
        return this.defaultData;
    }

    getSubDataTableData() {
        return this.subDataTableData;
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

    getEditData(): any {
        return {
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
}

export default new DataTableMock();