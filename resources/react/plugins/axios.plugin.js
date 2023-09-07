import axios from "axios";

export class AxiosPlugin {
    constructor() {
        // Make an instant of axios
        this.api = axios.create();

        // Config axios default headers
        this.api.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
        this.api.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        this.api.defaults.headers.common["Accept"] = "application/json";

        // Config axios request interceptor
        this.api.interceptors.request.use(
            (config) => this.onRequestSuccess(config), // Do sonething before request sent
            (error) => this.onRequestError(error) // Do something with request error
        );

        // Config axios response interceptor
        this.api.interceptors.response.use(
            (response) => this.onResponseSuccess(response), // Do something when response in 2xx status
            (error) => this.onResponseError(error) // Do something when response got error
        );
    }

    // Request success interceptor
    onRequestSuccess(config) {
        return config;
    }

    // Request error interceptor
    onRequestError(err) {
        return Promise.reject(err);
    }

    // Response success interceptor
    onResponseSuccess(resp) {
        return resp;
    }

    // Response error interceptor
    onResponseError(err) {
        return Promise.reject(err);
    }

    // Config general api request
    async _request(method, url, params, data, headers = {}, config = {}) {
        return await this.api.request({
            ...config,
            url,
            params,
            data,
            method: method.toLowerCase(),
            headers,
        });
    }

    // Config get request
    async _get(url, params = {}, headers = {}, config = {}) {
        return await this._request("get", url, params, {}, headers, config);
    }

    // Config post request
    async _post(url, data = {}, headers = {}, config = {}) {
        return await this._request("post", url, {}, data, headers, config);
    }

    // Config put request
    async _put(url, data, headers = {}, config = {}) {
        return await this._request("put", url, {}, data, headers, config);
    }

    // Config delete request
    async _delete(url, data = {}, headers = {}, config = {}) {
        return await this._request("delete", url, {}, data, headers, config);
    }

    async get(url, params = {}, headers = {}) {
        return this._get(url, params, headers);
    }

    async post(url, data = {}, headers = {}) {
        return this._post(url, data, headers);
    }

    async put(url, data = {}, headers = {}) {
        return this._put(url, data, headers);
    }

    async delete(url, data = {}, headers = {}) {
        return this._delete(url, data, headers);
    }
}
