import axios from "axios";

export class AppUtil {
    roleIsDev(role: string): boolean {
        return role === 'developer';
    }

    /**
     * @param url
     * @param params
     * @param onSuccess
     */
    action(url: string, params: object, onSuccess: object){
        axios
            .get('/api/' + url, {params: params})
            .then(onSuccess).catch(error => {
                console.error(error);
            }
        );
    }
}