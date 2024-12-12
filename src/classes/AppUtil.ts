import axios from "axios";
import {reactive} from "vue";

export class AppUtil {
    private state: { isLoading: boolean };
    private readonly loaderDelay: number = 350;
    private actionIndex: number = 0;

    constructor() {
        this.state = reactive({
            isLoading: false, // Dit is nu reactief
        });
    }

    /**
     * @return boolean
     */
    isLoading(): boolean{
        return this.state.isLoading;
    }

    /**
     * @param role
     */
    roleIsDev(role: string): boolean {
        return role === 'developer';
    }

    /**
     * @param url
     * @param params
     * @param onSuccess
     * @param config
     */
    async doAction(url: string, params: object, onSuccess: any = null, config: object = {}){
        this.actionIndex++;

        let currentActionIndex = this.actionIndex;
        let isLoading = true;

        setTimeout(() => {
            if(isLoading) {
                this.state.isLoading = true;
            }
        }, this.loaderDelay);

        return axios
            .post('/api/' + url, {params: params}, config)
            .then((response: any) => {
                let successResponse = onSuccess(response);

                if(currentActionIndex == this.actionIndex){
                    this.state.isLoading = false;
                }

                isLoading = false;
                return successResponse;
            }).catch(error => {
                console.error(error);
            }
        );
    }
}

export const appUtil = new AppUtil();