import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

let isRefreshing = false;
let failedRequestQueue = [];

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies['nextauth.token']}`
        }
    });

    interface AxiosErrorResponse {
        code?: string;
    };

    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError<AxiosErrorResponse>) => {
        if (error.response.status === 401) {
            if (error.response?.data?.code === 'token.expired') {
                cookies = parseCookies()

                const { 'nextauth.refreshToken': refreshToken } = cookies;
                const originalConfig = error.config;

                if (!isRefreshing) {
                    isRefreshing = true;

                    api.post('/refresh', {
                        refreshToken
                    }).then(response => {
                        const { token } = response.data;

                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 60 * 60 * 24 * 30, // 30 days
                            path: '/'
                        });
                        setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
                            maxAge: 60 * 60 * 24 * 30, // 30 days
                            path: '/'
                        });


                        failedRequestQueue.forEach(request => request.onSucces(token));
                        failedRequestQueue = [];
                    }).catch(err => {
                        failedRequestQueue.forEach(request => request.onFailure(err));
                        failedRequestQueue = [];

                        if (process.browser) {
                            signOut();
                        } else {
                            return Promise.reject(new AuthTokenError());
                        }
                    }).finally(() => {
                        isRefreshing = false
                    })
                };

                return new Promise((resolve, reject) => {
                    failedRequestQueue.push({
                        onSucces: (token: string) => {
                            originalConfig.headers['Authorization'] = `bearer ${token}`

                            resolve(api(originalConfig))
                        },

                        onFailure: (err: AxiosError) => {
                            reject(err)
                        },
                    })
                })
            } else {
                if (process.browser) {
                    signOut();
                }
            };
        };

        return Promise.reject(error);
    });

    return api;
}