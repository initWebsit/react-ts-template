import request from '../../../../utils/request';
import { textURL } from "../../../../utils/config";
import {CommonRequest} from "../../../../interface/commonRequest/commonRequest";

// 登录
export function teacherHomeworkDetail(query: teacherHomeworkDetailType): Promise<any> {
    return request({
        url: `${textURL}/assistant/task/student/list`,
        method: 'get',
        params: query
    });
}

export interface teacherHomeworkDetailType extends CommonRequest {
    task_id: number,
    page: number,
    pagesize: number
}