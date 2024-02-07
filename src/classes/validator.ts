class Validator {
    readonly EMAIL    = 'email';
    readonly PRESENCE = 'presence';

    /**
     * @param required
     */
    getEmailRules(required: boolean = true): Array<any> {
        let rules = [
            (value: any) => {
                return (/.+@.+\..+/.test(value)) ? true : 'E-mail must be valid.';
            },
        ]

        if (required) {
            let requiredRule: any = (value: any) => {
                return value ? true : 'E-mail is required.'
            };

            rules.push(requiredRule);
        }

        return rules;
    }

    /**
     * @param type
     * @param parameters
     */
    get(type: string, parameters: Array<any>) {
        switch (type) {
            case this.EMAIL:
                return this.getEmailRules(...parameters);

            case this.PRESENCE:
                return [
                    (value: any) => {
                        return value ? true : 'Input is required.';
                    },
                ];
        }
    }
}

export default new Validator();