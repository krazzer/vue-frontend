export class DarkModeSetting {
    readonly DEFAULT = 'default';
    readonly DARK    = 'dark';
    readonly LIGHT   = 'light';

    value: string = this.DEFAULT;

    getDarkMode(): boolean {
        if (this.value == this.DARK) {
            return true;
        }

        if (this.value == this.LIGHT) {
            return false;
        }

        return false;
    }
}