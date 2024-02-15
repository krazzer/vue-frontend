import axios from "axios";

class Validator {
    readonly EMAIL      = 'email';
    readonly PRESENCE   = 'presence';
    readonly SERVERSIDE = 'server';

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
    get(type: string, parameters: Object) {
        switch (type) {
            case this.EMAIL:
                return this.getEmailRules(parameters.required);

            case this.PRESENCE:
                return [
                    (value: any) => {
                        return value ? true : 'Input is required.';
                    },
                ];

            case this.SERVERSIDE:
                return [
                    (value: any) => {
                        return this.getServerSideCheck(value, parameters.name);
                    },
                ];
        }
    }

    /**
     * @param value
     * @param name
     */
    async getServerSideCheck(value: string, name: string) {
        return await axios
            .post('/api/datatable/validate', {params: {value: value, name: name}})
            .then(response => {
                return response.data;
            }).catch(error => {
                return '' + error;
            });
    }
}

export default new Validator();