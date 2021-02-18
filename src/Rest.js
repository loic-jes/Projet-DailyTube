import config from "./config";

class Rest {

    static apiRequest(body, method = 'GET', login = false) {
        let url = config.api.baseUrl;
        let headers = {
            'Content-Type': 'application/json'
        };
        if (login) {
            url += 'user/login';
            body.login = true;
        }
        if (localStorage.getItem('user') != null && login) {
            let user = localStorage.getItem('user');
            body.user = parseInt(user);
        }
        let options = { method };
        if (method !== 'GET') {
            if (body.url !== undefined) {
                url += `${body.table}/${body.url}`;
                delete body.url;
            }
            if (localStorage.getItem('token') != null) {
                let token = localStorage.getItem('token');
                headers = {
                    'Content-Type': 'application/json',
                    'authorization': token
                };
            }
            options.headers = headers;
            options.body = JSON.stringify(body);
        }
        else {
            if (localStorage.getItem('token') != null) {
                let token = localStorage.getItem('token');
                headers = {
                    'Content-Type': 'application/json',
                    'authorization': token,
                    'allow': body.table
                };
            }
            else {
                headers = {
                    'Content-Type': 'application/json',
                    'allow': body.table
                };
            }
            for (const key in body) {
                url += body[key] + '/';
            }
            options.headers = headers;
        }
        try {
            return fetch(url, options);
        }
        catch (e) {
            console.error('Erreur api:' + e);
        }
    }
}

export default Rest;