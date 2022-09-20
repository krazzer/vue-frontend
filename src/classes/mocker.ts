export abstract class Mocker {
    constructor() {
    }

    mock(){
        if (import.meta.env.DEV) {
            this.addMock();
        }
    }

    abstract addMock(): void;
}