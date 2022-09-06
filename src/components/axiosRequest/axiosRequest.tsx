import React, {useEffect, useRef} from "react";
import ajax, {loadingInstance} from '../../utils/request';
import qs from 'qs';
import {
    Loading
} from '../../utils/loading';
import { notification } from 'antd';
import { getToken } from 'utils/auth';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import {useAuth} from "../../hook/common/common";
NProgress.configure({showSpinner: false}); // NProgress Configuration

const AxiosRequest = React.memo(() => {
    const {loginOut} = useAuth();
    const loginOutRef = useRef(loginOut);
    useEffect(() => {
        loginOutRef.current = loginOut;
    }, [loginOut]);
    useEffect(() => {
        const requestInter = ajax.interceptors.request.use(
            config => {
                let data: any = config.method === 'get' ? config.params : config.data;
                /* 统一使用NProgress过渡动画，不论传没传loading */
                NProgress.start(); // start progress bar
                /* 请求中统一使用loading作为公用加载动画，loading为true时整页loading,为特定值则特定位置loading */
                if (config.url && data.hasOwnProperty('loading')) {
                    if (loadingInstance[config.url]) {
                        loadingInstance[config.url].forEach((element) => {
                            element.close();
                        });
                        delete loadingInstance[config.url];
                    }
                    if (data.loading === true) {
                        let arr = [];
                        let loadingEle = Loading.service({
                            target: document.body
                        });
                        arr.push(loadingEle);
                        loadingInstance[config.url] = arr;
                    } else {
                        let arr = [];
                        if (data.loading.length && data.loading.length > 0) {
                            for (let i = 0; i < data.loading.length; i++) {
                                let loadingEle = Loading.service({
                                    target: data.loading[i]
                                });
                                arr.push(loadingEle);
                            }
                        } else {
                            let loadingEle = Loading.service({
                                target: data.loading
                            });
                            arr.push(loadingEle);
                        }
                        loadingInstance[config.url] = arr;
                    }
                    delete data['loading'];
                }
                Object.keys(data).forEach(val => {
                    if (data[val] === '' || data[val] === null) {
                        return delete data[val]
                    }
                });
                const access_token: string = getToken() || '';
                let assignData: any;
                if (config.url === '/v1/admin/login') {
                    assignData = Object.assign({}, data);
                } else {
                    assignData = Object.assign(data, {
                        token: access_token
                    });
                }
                if (config.method === 'get') {
                    qs.stringify(assignData);
                    config.params = assignData;
                } else {
                    config.data = assignData;
                }
                return config;
            }, error => {
                for (let key in loadingInstance) {
                    loadingInstance[key].forEach((element) => {
                        element.close();
                    });
                    delete loadingInstance[key];
                }
                NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
                return Promise.reject(error)
            });

        const responseInter = ajax.interceptors.response.use((response) => {
            const {
                code
            } = response.data;
            if (code !== 10000) { // 800000是轮询成功的情况。需要加一层判断, 是登录失效还是接口错误
                if (code === 40301 || code === 40302 || code === 40004) {
                    notification.destroy();
                    notification['error']({
                        message: '错误',
                        description: '登录超时,请重新登录',
                        duration: 2
                    });
                    loginOutRef.current(null);
                }
                notification.destroy();
                if (response.data.message) {
                    notification['error']({
                        message: '错误',
                        description: response.data.message,
                        duration: 2
                    });
                }
            }
            if (response.config && response.config.url && loadingInstance[response.config.url]) {
                loadingInstance[response.config.url].forEach((element) => {
                    element.close();
                });
                delete loadingInstance[response.config.url];
            }
            NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
            return response.data
        }, err => {
                for (let key in loadingInstance) {
                    loadingInstance[key].forEach((element) => {
                        element.close();
                    });
                    delete loadingInstance[key];
                }
                NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
                const {
                    response,
                    request
                } = err;
                const {
                    status
                } = request;
                if (!response) {
                    notification.destroy();
                    notification['error']({
                        message: '错误',
                        description: `${status}:网络连接失败`,
                        duration: 5
                    })
                } else {
                    notification.destroy();
                    notification['error']({
                        message: '错误',
                        description: `${status}:网络连接失败`,
                        duration: 5
                    });
                }

                return Promise.reject(err)
            });
        return () => {
            ajax.interceptors.request.eject(requestInter);
            ajax.interceptors.request.eject(responseInter);
        };
    }, [loginOutRef]);
    return (
        <></>
    )
});

export default AxiosRequest;