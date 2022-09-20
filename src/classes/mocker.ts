import type MockAdapter from "axios-mock-adapter";

export abstract class Mocker {
    constructor() {
    }

    mock(mocker: MockAdapter) {
        if (import.meta.env.DEV) {
            this.addMock(mocker);
        }
    }

    abstract addMock(mocker: MockAdapter): void;
}