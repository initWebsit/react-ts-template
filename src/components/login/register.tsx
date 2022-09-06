import styled from "@emotion/styled";
import React, {useCallback, useState} from 'react';
import {Button, Form, Input, notification} from "antd";
import CommonIcon from "../common/CommonIcon";
import CodeButton from "../common/codeButton";
import {getCode, getCodeType, resetPassword, resetPasswordType} from "../../api/login/login";

const LoginBox = styled.div`
  width: 64rem;
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
  .goBack{
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
    user-select: none;
    &:hover{
      text-decoration-line: underline;
    }
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


const Register = React.memo(({setShowRegisterFunc}: {setShowRegisterFunc: (status: boolean) => void}) => {
    // 当前form对象
    const [form] = Form.useForm();
    // 验证码当前是否正在获取状态
    const [codeStatus, setCodeStatus] = useState(false);
    // 验证码验证字端
    const [encryption_str, setEncryption_str] = useState('');

    // 登录方法
    const confirmFunc = useCallback((params: {phone: number, code: string, password: string}) => {
        let Json:resetPasswordType = {
            phone_number: params.phone,
            m_code: params.code,
            new_password: params.password,
            encryption_str: encryption_str,
            loading: document.getElementsByClassName('registerFormBox')[0]
        };
        resetPassword(Json).then((res) => {
            if (res.code === 10000) {
                notification['success']({
                    message: '成功',
                    description: '密码修改成功,请登录~~',
                    duration: 2
                });
                setShowRegisterFunc(false);
            }
        });
    }, [encryption_str, setShowRegisterFunc]);

    // 手机号验证方法
    const phoneValidator = useCallback((rule: any, value: number): Promise<any> | void => {
        if (/^[1]{1}[0-9]{10}$/.test(value + '')) {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('请输入正常的手机号~~'));
        }
    }, []);

    // 密码验证方法
    const passwordValidator = useCallback((rule: any, value: string): Promise<any> | void => {
        if (!value || value.length < 8 || value.length > 15) {
            return Promise.reject(new Error('请输入正确的密码(8~15位)~'));
        } else {
            return Promise.resolve();
        }
    }, []);

    // 获取验证码按钮点击方法
    const onSearch = useCallback(() => {
        if (codeStatus) {
            return false;
        }
        form.validateFields(['phone']).then(() => {
            setCodeStatus(true);
            let Json: getCodeType = {
                phone_number: form.getFieldValue('phone'),
                loading: document.getElementsByClassName('registerFormBox')[0]
            };
            getCode(Json).then((data: any) => {
                if (data.code === 10000) {
                    setEncryption_str(data.data.encryption_str);
                    notification['success']({
                        message: '成功',
                        description: '短信验证码已发送，请注意查收~~',
                        duration: 2
                    });
                }
            });
        });
    }, [form, codeStatus]);

    return (
        <LoginBox className={'registerFormBox'}>
            <h4>找回密码</h4>
            <Form form={form} name={'registerForm'} onFinish={confirmFunc} labelCol={{span: 3}} labelAlign={'left'}>
                <Form.Item label={'手机号'} name={'phone'} rules={[{'required': true, 'message': '请输入正确的手机号~', 'validator': phoneValidator}]}>
                    <Input prefix={<CommonIcon className={'iconfont iconxuesheng1'}/>} size={'large'} placeholder={'请输入手机号'} type={'number'}/>
                </Form.Item>
                <Form.Item label={'验证码'} name={'code'} rules={[{'required': true, 'message': '请输入验证码~'}]}>
                    <Input.Search
                        prefix={<CommonIcon className={'iconfont iconmima'}/>}
                        placeholder="请输入验证码"
                        allowClear
                        enterButton={<CodeButton status={codeStatus} setStatus={setCodeStatus}/>}
                        size="large"
                        onSearch={(value) => onSearch()}
                    />
                </Form.Item>
                <Form.Item label={'新密码'} name={'password'} rules={[{'required': true, 'message': '请输入正确的密码(8~15位)~', 'validator': passwordValidator}]}>
                    <Input prefix={<CommonIcon className={'iconfont iconmima'}/>} size={'large'} placeholder={'请输入密码'} type={'password'}/>
                </Form.Item>
                <RememberPasswordBox>
                    <span className={'goBack'} onClick={() => setShowRegisterFunc(false)}>返回登录</span>
                </RememberPasswordBox>
                <Form.Item className={'buttonBox'}>
                    <LoginOutButton type={'primary'} htmlType={'submit'}>确认</LoginOutButton>
                </Form.Item>
            </Form>
        </LoginBox>
    )
}, (pre, next) => {
    // 返回false则重新渲染， 返回true则不渲染
    if (pre.setShowRegisterFunc === next.setShowRegisterFunc) {
        return true;
    } else {
        return false;
    }
});

export default Register;