export class Mocker {
    constructor() {
    }

    mock(){
        if (import.meta.env.DEV) {
            this.addMock();
        }
    }

    addMock() {

    }
}