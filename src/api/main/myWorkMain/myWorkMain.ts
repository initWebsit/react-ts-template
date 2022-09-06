import request from '../../../utils/request';
import { textURL } from "../../../utils/config";
import {CommonRequest} from "../../../interface/commonRequest/commonRequest";

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
    subject_id: string,
    page: number,
    pagesize: number,
    start_time?: string,
    end_time?: string
}