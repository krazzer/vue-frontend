export class Translator {
    public strings = {};

    setStrings(strings) {
        this.strings = strings;
    }

    tl(name: string, replaces: object) {
        let string = this.strings[name];

        if( ! replaces){
            return string;
        }

        for (const [key, value] of Object.entries(replaces)) {
            string = string.replace(':' + key, value);
        }

        return string;
    }
}