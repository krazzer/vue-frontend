import axios from "axios";
import {reactive} from "vue";

export class AppUtil {
    private state: { isLoading: boolean, preventSelect: boolean };
    private readonly loaderDelay: number = 350;
    private actionIndex: number = 0;

    constructor() {
        this.state = reactive({
            isLoading: false,
            preventSelect: false,
        });
    }

    /**
     * @return boolean
     */
    isBusyLoading(): boolean{
        return this.state.isLoading;
    }

    /**
     * @return boolean
     */
    isPreventSelect(): boolean{
        return this.state.preventSelect;
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

        let handleLoader = () => {
            if(currentActionIndex == this.actionIndex){
                this.state.isLoading = false;
            }

            isLoading = false;
        }

        return axios
            .post('/api/' + url, {params: params}, config)
            .then((response: any) => {
                let successResponse = onSuccess ? onSuccess(response) : null;
                handleLoader();
                return successResponse;
            }).catch(error => {
                handleLoader();
                console.error(error);
            }
        );
    }

    getIndexById(data: any, id: number | string): number {
        let foundIndex = 0;

        data.forEach((row: any, index: number) => {
            if (id == row.id) {
                foundIndex = index;
            }
        });

        return foundIndex;
    }

    setPreventSelect(set: boolean){
        this.state.preventSelect = set;
    }
}

export const appUtil = new AppUtil();