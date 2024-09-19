import type MockAdapter from "axios-mock-adapter";

class AppMock {
    mock(mocker: MockAdapter) {
        mocker.onGet("/api/translations").reply(() => {
            return [200, {
                'datatable.deleteSinlge': 'Are you sure you want to delete this item?',
                'datatable.deleteMultiple': 'Are you sure you want to delete these :amount items?',
                'general.search': 'Search',
                'general.language': 'Language',
                'media.editKeyPrompt': 'Give a name for the key of this file',
                'media.newFolderPrompt': 'Give a name for the new folder',
                'media.newFolderPlaceholder': 'New folder',
                'media.upload': 'Upload',
                'media.newFolder': 'New folder',
                'media.cut': 'Cut',
                'media.editKey': 'Edit key',
            }];
        });
    }
}

export default new AppMock();