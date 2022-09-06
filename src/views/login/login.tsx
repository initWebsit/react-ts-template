import React, {useCallback, useState} from 'react';
import styled from "@emotion/styled";
import loginBg from '../../assets/images/login/bg.png';
import Register from "../../components/login/register";
import Login from "../../components/login/login";

const LoginBgBox = styled.div`
      position: relative;
      width: 100%;
      height: 100vh;
      background: ${() => `url(${loginBg}) no-repeat center/100% 100%`};
    `

const LoginBox = () => {
    // 是否打开忘记密码页
    const [showRegister, setShowRegister] = useState(false);
    // 是否打开忘记密码页切换事件
    const setShowRegisterFunc = useCallback((status: boolean) => {
        setShowRegister(status);
    }, [setShowRegister]);

    return (
        <LoginBgBox>
            {
                showRegister ?
                    <Register setShowRegisterFunc={setShowRegisterFunc}/>
                :
                    <Login setShowRegisterFunc={setShowRegisterFunc}/>
            }
        </LoginBgBox>
    )
}

export default LoginBox;