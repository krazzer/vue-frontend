class Validator {
    /**
     * @param required
     */
    getEmailRules(required: boolean = true): Array<any> {
        let rules = [
            (value: any) => {
                return (/.+@.+\..+/.test(value)) ? true : 'E-mail must be valid.';
            },
        ]

        if(required){
            let requiredRule: any = (value: any) => {
                return value ? true : 'E-mail is required.'
            };

            rules.push(requiredRule);
        }

        return rules;
    }
}

export default new Validator();