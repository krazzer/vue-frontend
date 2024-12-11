import {ValidationParameters} from "./ValidationParameters";
import appUtil, {AppUtil} from "@/classes/AppUtil";

class Validator {
    readonly EMAIL      = 'email';
    readonly PRESENCE   = 'presence';
    readonly SERVERSIDE = 'server';

    private appUtil: AppUtil;

    constructor() {
        this.appUtil = appUtil;
    }

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
    get(type: string, parameters: ValidationParameters) {
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
        return await this.appUtil.doAction('datatable/validate', {value: value, name: name}, (response: any) => {
            return response.data;
        });
    }
}

export default new Validator();