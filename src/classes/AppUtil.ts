import axios from "axios";

export class AppUtil {
    roleIsDev(role: string): boolean {
        return role === 'developer';
    }

    /**
     * @param url
     * @param params
     * @param onSuccess
     * @param config
     */
    doAction(url: string, params: object, onSuccess: any = null, config: object = {}){
        return axios
            .post('/api/' + url, {params: params}, config)
            .then(onSuccess).catch(error => {
                console.error(error);
            }
        );
    }
}

export default new AppUtil;