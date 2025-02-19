import {ValidationParameters} from "./ValidationParameters";
import {appUtil} from "@/classes/AppUtil";
import type {Translator} from "@/classes/translator";

export default class Validator {
    readonly EMAIL      = 'email';
    readonly PRESENCE   = 'presence';
    readonly SERVERSIDE = 'server';

    public appUtil = appUtil;
    public translator: Translator;

    constructor(translator: Translator) {
        this.translator = translator;
    }

    /**
     * @param required
     */
    getEmailRules(required: boolean = true): Array<any> {
        let rules = [
            (value: any) => {
                return (/.+@.+\..+/.test(value)) ? true : this.translator.tl('validation.email');
            },
        ]

        if (required) {
            let requiredRule: any = (value: any) => {
                return value ? true : this.translator.tl('validation.emailRequired')
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
                        return value ? true : this.translator.tl('validation.inputRequired');
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