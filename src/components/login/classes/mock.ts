import axios from "axios";
import type MockAdapter from "axios-mock-adapter";

class LoginMock
{
    loggedIn: boolean;

    constructor() {
        if(localStorage.loggedIn) {
            this.loggedIn = JSON.parse(localStorage.loggedIn);
        } else {
            this.loggedIn = false;
        }
    }

    mock(mocker: MockAdapter){
        mocker.onGet("/api/login").reply((request) => {
            let params = request.params;

            if (params.password === 'networkerror') {
                return axios.get("mock-network-error");
            }

            if (params.password === 'timeout') {
                return axios.get("mock-network-timeout");
            }

            if (params.password === 'error') {
                return [503];
            }

            this.loggedIn = true;
            localStorage.loggedIn = JSON.stringify(true);

            return [200, {success: params.password === 'test' && params.email === 'test@test.com'}];
        });

        mocker.onGet("mock-network-error").networkError();
        mocker.onGet("mock-network-timeout").timeout();
    }
}

export default new LoginMock();