import type MockAdapter from "axios-mock-adapter";

class DataTableMock {
    mock(mocker: MockAdapter) {
        let clientsDataTable = this.getDefaultData();

        mocker.onGet("/api/datatable").reply(() => {
            let params = {settings: clientsDataTable};
            return [200, params];
        });
    }

    getDefaultData() {
        return  {
            addButtonLabel: 'Add client',
            headers: ['id', 'name', 'address', 'zip'],
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

    getPagesData(){
        return  {
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
}

export default new DataTableMock();