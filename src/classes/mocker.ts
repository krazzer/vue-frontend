import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import dataTableMock from "@/components/datatable/classes/mock";
import loginMock from "@/components/login/classes/mock";
import homeMock from "@/components/home/classes/mock";
import mediaMock from "@/components/media/classes/mock";
import formMock from "@/components/form/classes/mock";
import appMock from "@/classes/mock";

export class Mocker {
    mocker;
    public dataTableMock;
    public loginMock;
    public homeMock;
    public mediaMock;
    public appMock;
    public formMock;

    constructor(delay: number = 50) {
        this.mocker = new MockAdapter(<any> axios, {delayResponse: delay});

        this.dataTableMock = dataTableMock;
        this.loginMock     = loginMock;
        this.homeMock      = homeMock;
        this.appMock       = appMock;
        this.mediaMock     = mediaMock;
        this.formMock     = formMock;
    }

    mock() {
        this.dataTableMock.mock(this.mocker);
        this.loginMock.mock(this.mocker);
        this.homeMock.mock(this.mocker, this);
        this.appMock.mock(this.mocker);
        this.formMock.mock(this.mocker);
        this.mediaMock.mock(this.mocker, this);

        return this;
    }
}