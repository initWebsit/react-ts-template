import request from '../../utils/request';
import { textURL } from "../../utils/config";
import {CommonRequest} from "../../interface/commonRequest/commonRequest";

// 登录
export function Login(query: LoginType): Promise<any> {
    return request({
        url: `${textURL}/assistant/login`,
        method: 'post',
        data: query
    })
}

export interface LoginType extends CommonRequest {
    account: string,
    password: string
}

// 退出登录
export function LoginOut(query: any): Promise<any> {
    return request({
        url: `${textURL}/assistant/logout`,
        method: 'delete',
        data: query
    })
}

// 获取短信验证码api
export function getCode(query: getCodeType): Promise<any> {
    return request({
        url: `${textURL}/assistant/sms/code`,
        method: 'get',
        params: query
    })
}
export interface getCodeType extends CommonRequest {
    phone_number: number
}

// 重置密码api
export function resetPassword(query: resetPasswordType): Promise<any> {
    return request({
        url: `${textURL}/assistant/password/reset`,
        method: 'post',
        data: query
    })
}

export interface resetPasswordType extends CommonRequest {
    phone_number: number,
    m_code: string,
    new_password: string,
    encryption_str: string
}
