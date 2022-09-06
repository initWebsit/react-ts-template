import {createSlice} from '@reduxjs/toolkit';
// import {UserInfo} from "../../context/userInfoContext/userInfoContext";
import {getUserInfo, removeUserInfo, setToken, setUserInfo as setUserInfoFunc} from "../../utils/auth";
import {RootStateType} from "../index";

export interface UserInfo {
    perm_group_ids?: string[],
    phone_number: string,
    role_name: string,
    username: string,
    user_guid: number
};

type User = UserInfo | null;

const initialState: {user: User} = {
    user: getUserInfo() ? getUserInfo() : null
}

export const auth = createSlice({
    name: 'authRedux',
    initialState,
    reducers: {
        login(state, action) {
            if (action.payload) {
                state.user = action.payload.user_info;
                setUserInfoFunc({...action.payload.user_info});
                setToken(action.payload.token);
            }
        },
        register(state, action) {
            if (action.payload) {
                state.user = action.payload.user_info;
                setUserInfoFunc({...action.payload.user_info});
                setToken(action.payload.token);
            }
        },
        loginOut(state, action) {
            state.user = null;
            removeUserInfo();
            setToken('');
        }
    }
});

export const userSelectorCallback = (state: RootStateType) => state.auth.user;
export const loginAction = auth.actions.login;
export const registerAction = auth.actions.register;
export const loginOutAction = auth.actions.loginOut;