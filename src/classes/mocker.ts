import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import dataTableMock from "@/components/datatable/classes/mock";
import loginMock from "@/components/login/classes/mock";
import homeMock from "@/components/home/classes/mock";

export class Mocker {
    mocker;
    public dataTableMock;
    public loginMock;
    public homeMock;

    constructor(delay: number = 50) {
        this.mocker = new MockAdapter(axios, {delayResponse: delay});

        this.dataTableMock = dataTableMock;
        this.loginMock = loginMock;
        this.homeMock = homeMock;
    }

    mock() {
        this.dataTableMock.mock(this.mocker);
        this.loginMock.mock(this.mocker);
        this.homeMock.mock(this.mocker);
    }
}