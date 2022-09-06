import request from '../../../../utils/request';
import { textURL } from "../../../../utils/config";
import {CommonRequest} from "../../../../interface/commonRequest/commonRequest";

// 登录
export function correctDetail(query: correctDetailType): Promise<any> {
    return request({
        url: `${textURL}/assistant/student/data`,
        method: 'get',
        params: query
    });
}

export interface correctDetailType extends CommonRequest {
    task_id: number,
    meta_data_id: number,
    page: number,
    pagesize: number
}