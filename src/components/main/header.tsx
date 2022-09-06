import React, {useState, useCallback} from 'react';
import styled from '@emotion/styled';
import loginImg from '../../assets/images/header/logo.png';
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../../hook/common/common";
import CommonIcon from "../common/CommonIcon";

const HeaderBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-width: 128.8rem;
  width: 100%;
  height: 6.4rem;
  line-height: 6.4rem;
  background: #176ae5;
`

const HeaderContainer = styled.div`
  width: 128.8rem;
  padding: 0 2rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .leftBox{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &>img{
      height: 3.2rem;
      display: block;
      margin-right: 2rem;
    }
    .navigateBox{
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0;
      .navigateLink{
        line-height: 6.4rem;
        width: 13rem;
        text-align: center;
        cursor: pointer;
        color: #fff;
        font-size: 1.8rem;
        font-weight: 500;
      }
    }
  }
  .rightBox{
    position: relative;
    .userBox{
      position: relative;
      cursor: pointer;
      width: 13rem;
      height: 6.4rem;
      line-height: 6.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .userName{
        color: #fff;
        font-size: 1.4rem;
        min-width: 7rem;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0 0.5rem 0 0;
        font-weight: 500;
      }
      .iconxialaanniu{
        font-size: 1rem;
        color: #fff;
        transition: all 0.5s;
        transform: rotate(0deg);
      }
      .rotate{
        transform: rotate(180deg);
      }
    }
    .userOperatorBox{
      z-index: 3000;
      position: absolute;
      left: 0;
      top: 6.3rem;
      background: #fff;
      width: 100%;
      cursor: pointer;
      box-shadow: 0 0 0.5rem #ccc;
      .arrow{
        position: absolute;
        top: -2rem;
        left: calc(50% - 1rem);
        width: 0rem;
        height: 0rem;
        border-top: 1rem solid transparent;
        border-left: 1rem solid transparent;
        border-right: 1rem solid transparent;
        border-bottom: 1rem solid #fff;
      }
      p{
        height: 40px;
        line-height: 40px;
        color: #333;
        font-size: 15px;
        text-align: center;
        border-bottom: 1px solid #d8d8d8;
        margin: 0;
        &:hover{
          color: #176ae5;
        }
      }
      p:nth-last-of-type(1){
        border-bottom: none;
      }
    }
  }
`

const NavigateLine = styled.span`
  position: absolute;
  left: ${({index}: {index: number}) => `${index*130+50}px`};
  bottom: 15px;
  width: 30px;
  height: 1px;
  background: #fff;
  transition: left 0.5s;
`

const Header = () => {
    const location = useLocation();
    const {userInfo, loginOut} = useAuth();
    const [mouseEnter, setMouseEnter] = useState(false);
    const navigateList = [
        {
            path: '/main/myWorkMain',
            name: '我的任务'
        },
        {
            path: '/main/myWorkLoadMain',
            name: '我的工作量'
        },
        {
            path: '/main/updateWorkMain',
            name: '上传作业'
        }
    ];

    // 鼠标移动到用户姓名监听事件
    const mouseEnterOutFunc = useCallback((status: boolean) => {
        setMouseEnter(status);
    }, []);

    // 退出登录按钮点击事件
    const loginOutFunc = useCallback(() => {
        loginOut();
    }, [loginOut]);
    return (
        <HeaderBox>
            <HeaderContainer>
                <div className={'leftBox'}>
                    <img src={loginImg} alt={'logo'}/>
                    <div className={'navigateBox'}>
                        {
                            navigateList.map((element, index) =>
                                <p className={'navigateBox'} key={element.path}>
                                    <Link className={'navigateLink'} to={element.path}>{element.name}</Link>
                                </p>
                            )
                        }
                        <NavigateLine index={navigateList.findIndex(res => location.pathname.indexOf(res.path) !== -1) !== -1 ? navigateList.findIndex(res => location.pathname.indexOf(res.path) !== -1) : 0}/>
                    </div>
                </div>
                <div className={'rightBox'}
                     onMouseEnter={() => mouseEnterOutFunc(true)}
                     onMouseLeave={() => mouseEnterOutFunc(false)}>
                    <div className={'userBox'}>
                        <p className={'userName'}>{userInfo?.username}</p>
                        <CommonIcon className={`iconfont iconxialaanniu ${mouseEnter?'rotate': ''}`}/>
                    </div>
                    {
                        mouseEnter ?
                            <div className={'userOperatorBox'}>
                                <span className={'arrow'}></span>
                                <p>修改密码</p>
                                <p onClick={() => loginOutFunc()}>退出登录</p>
                            </div>
                            : null
                    }
                </div>
            </HeaderContainer>
        </HeaderBox>
    )
}

export default Header;