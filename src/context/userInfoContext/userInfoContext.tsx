import React, {ReactElement, useContext, useState} from "react";
import ajax from 'utils/request';
import { setUserInfo as setUserInfoFunc, removeUserInfo, getUserInfo, setToken } from "../../utils/auth";

export interface UserInfo {
    account: string,
    password: string,
    name: string,
    token: string
}
export interface LoginParams {
    account: string,
    password: string
}
interface UserContext {
    userInfo: UserInfo | undefined,
    login: (params: LoginParams) => void,
    register: (params: LoginParams) => void,
    loginOut: () => void
}

export const requestTest = () => {
    return ajax({
        method: 'get',
        url: 'https://zycs.canpoint.net/v1/teacher/info?token=eyJhbGciOiJIUzUxMiIsImlhdCI6MTYzOTc5Nzc4MiwiZXhwIjoxNjQyMzg5NzgyfQ.eyJ1c2VyX2d1aWQiOjE0MTE4MTM4Niwicm9sZV9pZCI6MTYsInV1aWQiOiJjZWVmNjk0MjVmYjExMWVjYWI3YjAwMTYzZTEyYTg2MyIsImNsaWVudCI6MTYzOTc5Nzc4Mn0.uKJNoZgDgsgfkZOarMJrPI4LTzps24t68hCNoMBAFp7sNIKceEyA3SxpARTtrjj8vihp6zy3XAre-1uywN1Znw',
        params: {
            loading: document.body
        }
    });
}

const UserInfoContext = React.createContext<UserContext | null>(null);

export const UserInfoProvider = ({children}: {children: ReactElement | never[]}) => {
    const [userInfo, setUserInfo] = useState<UserInfo | undefined>(getUserInfo());
    const login = (params: LoginParams):void => {requestTest();setUserInfo({...params, name: params.account, token: 'testToken'});setUserInfoFunc({...params, name: params.account, token: 'testToken'});setToken('testToken');}
    const register = (params: LoginParams):void => {setUserInfo({...params, name: params.account, token: 'testToken'});}
    const loginOut = ():void => {setUserInfo(undefined);removeUserInfo();setToken('');}
    return (
        <UserInfoContext.Provider value={{userInfo, login, register, loginOut}}>
            {children}
        </UserInfoContext.Provider>
    )
}

export const useUserInfo = () => {
    const value = useContext(UserInfoContext);
    if (!value) {
        throw new Error('useUserInfo必须要在UserInfoProvider下使用!');
    }
    return value;
}