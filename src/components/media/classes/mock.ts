import type MockAdapter from "axios-mock-adapter";

class MediaMock {
    mock(mocker: MockAdapter) {
        mocker.onGet("/api/media/newfolder").reply((request) => {
            let name   = request.params.name;
            let params = {name : name};

            return [200, params];
        });
    }
}

export default new MediaMock();