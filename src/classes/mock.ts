import type MockAdapter from "axios-mock-adapter";

class AppMock {
    mock(mocker: MockAdapter) {
        mocker.onPost("/api/translations").reply(() => {
            return [200, {
                'datatable.deleteSinlge': 'Are you sure you want to delete this item?',
                'datatable.deleteMultiple': 'Are you sure you want to delete these :amount items?',
                'general.search': 'Search',
                'general.cancel': 'Cancel',
                'general.loading': 'loading...',
                'general.language': 'Language',
                'general.save': 'Save',
                'general.saveAndClose': 'Save & close',
                'general.saved': 'Saved',
                'general.close': 'Close',
                'general.closeWarning': 'You have unsaved changed, are you sure you want to close this window?',
                'media.editKeyPrompt': 'Give a name for the key of this file',
                'media.newFolderPrompt': 'Give a name for the new folder',
                'media.newFolderPlaceholder': 'New folder',
                'media.upload': 'Upload',
                'media.newFolder': 'New folder',
                'media.cut': 'Cut',
                'media.editKey': 'Edit key',
                'media.paste': 'Paste',
                'media.delete': 'Delete',
                'media.deleteConfirm': 'Are you sure you want to delete the selected files?',
            }];
        });
    }
}

export default new AppMock();