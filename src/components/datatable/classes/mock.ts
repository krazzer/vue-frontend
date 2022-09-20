import {Mocker} from "@/classes/mocker";
import type MockAdapter from "axios-mock-adapter";

class DataTableMock extends Mocker {
    addMock(mocker: MockAdapter) {
        let clientsDataTable = {
            addButtonLabel: 'New client',
            headers: ['id', 'name', 'address', 'zip'],
            data: [
                [1, 'Peter', 'Peterstreet 17', '12345'],
                [2, 'John', 'Johnstreet 17', '23456'],
                [3, 'Susan', 'Susanstreet 17', '34567'],
                [4, 'Henry', 'Henrystreet 17', '45678'],
                [5, 'Naomi', 'Naomistreet 17', '56789'],
            ],
            instance: 'test',
        };

        mocker.onGet("/api/datatable").reply(() => {
            let params = {settings: clientsDataTable};
            return [200, params];
        });
    }
}

export default new DataTableMock();