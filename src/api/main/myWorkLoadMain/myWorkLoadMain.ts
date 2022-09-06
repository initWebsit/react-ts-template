import request from '../../../utils/request';
import { textURL } from "../../../utils/config";
import {CommonRequest} from "../../../interface/commonRequest/commonRequest";

// 登录
export function getMyWorkloadList(query: LoginType): Promise<any> {
    return request({
        url: `${textURL}/assistant/workload/list`,
        method: 'get',
        params: query
    });
}

export interface LoginType extends CommonRequest {
    subject_id: string,
    page: number,
    pagesize: number,
    start_time?: string,
    end_time?: string
}