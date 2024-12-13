import type MockAdapter from "axios-mock-adapter";

class FormMock {
    mock(mocker: MockAdapter) {
        mocker.onPost("/api/form/save").reply(() => {
            return [200];
        });
    }
}

export default new FormMock();