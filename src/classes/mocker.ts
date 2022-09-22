import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import dataTableMock from "@/components/datatable/classes/mock";
import loginMock from "@/components/login/classes/mock";
import homeMock from "@/components/home/classes/mock";

export class Mocker {
    mocker: MockAdapter;

    constructor() {
        this.mocker = new MockAdapter(axios, {delayResponse: 50});
    }

    mock() {
        dataTableMock.mock(this.mocker);
        loginMock.mock(this.mocker);
        homeMock.mock(this.mocker);
    }
}