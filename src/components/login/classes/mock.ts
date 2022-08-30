import {Mocker} from "@/classes/mocker";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

class LoginMock extends Mocker
{
    loggedIn: boolean;

    constructor() {
        super();

        if(localStorage.loggedIn) {
            this.loggedIn = JSON.parse(localStorage.loggedIn);
        } else {
            this.loggedIn = false;
        }
    }

    addMock(){
        let mock = new MockAdapter(axios, {delayResponse: 50});

        mock.onGet("/api/login").reply((request) => {
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

            return [200, {success: params.password === 'test' && params.email === 'test@test.com'}];
        });

        mock.onGet("mock-network-error").networkError();
        mock.onGet("mock-network-timeout").timeout();
    }
}

export default new LoginMock();