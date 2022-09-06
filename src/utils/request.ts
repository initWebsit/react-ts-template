import axios from 'axios';
import qs from 'qs';
import {
    CloseClassType
} from './loading';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
NProgress.configure({showSpinner: false}); // NProgress Configuration

axios.defaults.withCredentials = true;
const ajax = axios.create({
    // baseURL,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
        // "Content-Type": "application/json"
    },
    withCredentials: false,
    transformRequest: [function (data) {
        return qs.stringify(data);
    }]
});
// 动态loading存储
export let loadingInstance: {[k in any]: CloseClassType[]} = {};
export default ajax;