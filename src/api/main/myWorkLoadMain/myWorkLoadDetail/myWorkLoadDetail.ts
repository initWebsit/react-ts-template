import request from '../../../../utils/request';
import { textURL } from "../../../../utils/config";
import {CommonRequest} from "../../../../interface/commonRequest/commonRequest";

// 登录
export function getWorkloadDetail(query: getWorkloadDetailType): Promise<any> {
    return request({
        url: `${textURL}/assistant/workload/info`,
        method: 'get',
        params: query
    });
}

export interface getWorkloadDetailType extends CommonRequest {
    task_ids: number,
    section_ids: string,
    page: number,
    pagesize: number
}