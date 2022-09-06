import request from '../../../../utils/request';
import { textURL } from "../../../../utils/config";
import {CommonRequest} from "../../../../interface/commonRequest/commonRequest";

// 登录
export function getReceivedWorkList(query: getReceivedWorkListType): Promise<any> {
    return request({
        url: `${textURL}/assistant/task/list`,
        method: 'get',
        params: query
    });
}

export interface getReceivedWorkListType extends CommonRequest {
    task_type: number,
    page: number,
    pagesize: number
}

// 登录
export function getWorkList(query: getWorkListType): Promise<any> {
    return request({
        url: `${textURL}/assistant/task/pool/list`,
        method: 'get',
        params: query
    });
}

export interface getWorkListType extends CommonRequest {
    page: number,
    pagesize: number
}