import type MockAdapter from "axios-mock-adapter";

class AppMock {
    translations: object;

    constructor() {
        this.translations = {
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
            'general.logout': 'Logout',
            'media.editKeyPrompt': 'Give a name for the key of this file',
            'media.editNamePrompt': 'Give a new name for this file',
            'media.newFolderPrompt': 'Give a name for the new folder',
            'media.newFolderPlaceholder': 'New folder',
            'media.upload': 'Upload',
            'media.newFolder': 'New folder',
            'media.cut': 'Cut',
            'media.editKey': 'Edit key',
            'media.paste': 'Paste',
            'media.delete': 'Delete',
            'media.pickFile': 'Pick file',
            'media.deleteConfirm': 'Are you sure you want to delete the selected files?',
            'login.login': 'Login',
            'login.emailAddress': 'E-mail address',
            'login.password': 'Password',
            'login.repeatPassword': 'Repeat password',
            'login.resetPasswordButton': 'Set new password',
            'login.remember': 'Remember me',
            'login.passwordLost': 'Lost password?',
            'login.wrongLogin': 'Wrong e-mail or password',
            'login.sendResetLink': 'Send password reset link',
            'login.backToLogin': 'Back to login',
            'login.resetLinkSendSuccess': 'If your e-mail address is registered, you will receive a password reset link shortly.',
            'login.resetLinkSendError': 'Something went wrong sending the reset e-mail. Please try again later.',
            'login.enterNewPassword': 'Enter a new password',
            'login.passwordMismatch': 'Passwords don\'t match',
            'validation.email': 'Invalid e-mail address',
            'validation.emailRequired': 'E-mail address is required',
            'validation.inputRequired': 'This field is required',
        };
    }

    mock(mocker: MockAdapter) {
        mocker.onPost("/api/translations").reply(() => {
            return [200, this.translations];
        });
    }

    getTranslations(){
        return this.translations;
    }
}

export default new AppMock();