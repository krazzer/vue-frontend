import type MockAdapter from "axios-mock-adapter";

class AppMock {
    mock(mocker: MockAdapter) {
        mocker.onGet("/api/translations").reply(() => {
            return [200, {
                'datatable.deleteSinlge': 'Are you sure you want to delete this item?',
                'datatable.deleteMultiple': 'Are you sure you want to delete these :amount items?',
                'general.search': 'Search',
                'general.language': 'Language',
            }];
        });
    }
}

export default new AppMock();