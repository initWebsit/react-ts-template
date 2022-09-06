import React, {useState, useCallback, useEffect} from 'react';
import styled from '@emotion/styled';
import {Button, Checkbox, Form, Input} from "antd";
import CommonIcon from "../common/CommonIcon";
// import {useUserInfo} from "../../context/userInfoContext/userInfoContext";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hook/common/common";
import {getLocalStorage, setLocalStorage} from "../../utils/auth";
import {LoginType} from "../../api/login/login";

const LoginBox = styled.div`
  width: 64rem;
  padding: 2rem;
  background: #fff;
  border-radius: 0.8rem;
  box-shadow: 0 0 2rem rgb(0 0 0 / 20%);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 4.8rem 6.4rem;
  &>h4{
    font-size: 2.6rem;
    color: #333;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5rem;
  }
  .ant-form-item-label > label{
    height: 4rem;
  }
  .buttonBox{
    margin-bottom: 0;
  }
  .iconfont{
    color: #c0c4cc;
    font-size: 16px;
  }
    `
const RememberPasswordBox = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .forgetPassword{
    font-size: 14px;
    color: #333;
    cursor: pointer;
    user-select: none;
    &:hover{
      color: #1890ff;
      text-decoration-line: underline;
    }
  }
  .ant-checkbox-wrapper{
    user-select: none;
  }
`

const LoginOutButton = styled(Button)`
  width: 100%;
  margin: 5rem 0 0 0;
  background: #1890FF;
  border-color: #1890FF;
  height: 4.8rem;
  line-height: 4.8rem;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
    `

const Login = React.memo(({setShowRegisterFunc}: {setShowRegisterFunc: (status: boolean) => void}) => {
    // use-context实现登录方法
    // const {login} = useUserInfo();
    // react-redux实现登录方法
    const {login} = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    // 忘记密码是否选中
    const [rememberPassword, setRememberPassword] = useState(getLocalStorage('assistant_account') && getLocalStorage('assistant_password') ? true : false);

    // 初始化账号密码方法
    const initAccount = useCallback(() => {
        if (getLocalStorage('assistant_account') && getLocalStorage('assistant_password')) {
            form.setFieldsValue({username: getLocalStorage('assistant_account'), password: getLocalStorage('assistant_password')});
        }
    }, [form]);

    // 记住密码切换事件
    const rememberPasswordChange = useCallback((checked: boolean) => {
        setRememberPassword(checked);
    }, [setRememberPassword]);
    // 登录方法
    const loginFunc = useCallback((params: {username: string, password: string}) => {
        // use-context实现登录方法
        // login({account: params.username, password: params.password});
        // react-redux实现登录方法
        let Json: LoginType = {
            account: params.username,
            password: params.password,
            loading: document.getElementsByClassName('loginFormBox')[0]
        };
        login(Json).then((res: any) => {
            if (res.code === 10000) {
                // 记住密码逻辑
                if (rememberPassword) {
                    setLocalStorage('assistant_account', params.username);
                    setLocalStorage('assistant_password', params.password);
                } else {
                    setLocalStorage('assistant_account', '');
                    setLocalStorage('assistant_password', '');
                }
                navigate('/main/myWorkMain');
            }
        });
    }, [login, navigate, rememberPassword]);

    // 初始化执行方法
    useEffect(() => {
        initAccount();
    }, [initAccount]);
    return (
        <LoginBox className={'loginFormBox'}>
            <h4>助教登录</h4>
            <Form form={form} onFinish={loginFunc} labelCol={{span: 3}} labelAlign={'left'}>
                <Form.Item label={'账号'} name={'username'} rules={[{'required': true, 'message': '请输入用户名~'}]}>
                    <Input prefix={<CommonIcon className={'iconfont iconxuesheng1'}/>} size={'large'}
                           placeholder={'请输入用户名'} type={'text'}/>
                </Form.Item>
                <Form.Item label={'密码'} name={'password'} rules={[{'required': true, 'message': '请输入密码~'}]}>
                    <Input prefix={<CommonIcon className={'iconfont iconmima'}/>} size={'large'}
                           placeholder={'请输入密码'} type={'password'}/>
                </Form.Item>
                <RememberPasswordBox>
                    <Checkbox checked={rememberPassword}
                              onChange={(e) => rememberPasswordChange(e.target.checked)}>记住密码</Checkbox>
                    <span className={'forgetPassword'} onClick={() => setShowRegisterFunc(true)}>忘记密码</span>
                </RememberPasswordBox>
                <Form.Item className={'buttonBox'}>
                    <LoginOutButton type={'primary'} htmlType={'submit'}>登录</LoginOutButton>
                </Form.Item>
            </Form>
        </LoginBox>
    )
}, (pre, next) => {
    if (pre.setShowRegisterFunc === next.setShowRegisterFunc) {
        return true;
    } else {
        return false;
    }
});

export default Login;