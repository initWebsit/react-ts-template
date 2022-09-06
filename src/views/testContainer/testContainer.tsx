import React, {useState, useCallback} from "react";
import SearchTab from "../../components/searchTab/searchTab";
import SearchTable from "../../components/searchTable/searchTable";
import styled from "@emotion/styled";
import {Button} from "antd";
import {useArray, useAuth, useMount, useUndo, useUrlParams} from "../../hook/common/common";
import {personSelectList} from "../../mock/test/test";
// import {useUserInfo} from "../../context/userInfoContext/userInfoContext";
import {useNavigate, Outlet} from "react-router-dom";

const ContainerBox = styled.div`
      max-width: 60rem;
      margin: 5rem auto;
      box-shadow: 0 0 1rem #ddd;
      padding: 2rem;
    `
const LoginOutButton = styled(Button)`
      width: 100%;
    `
const TitleIconBox = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
`
const OperationBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 4rem;
  grid-template-area: "button1 button2 button3 button4";
  grid-auto-columns: auto;
  grid-auto-rows: 4rem;
  grid-auto-flow: row;
  grid-column-gap: 0;
  grid-row-gap: 0;
  justify-content: center;
  align-content: center;
  justify-items: start;
  align-items: center;
  margin-bottom: 1rem;
  &>p {
    width: 7rem;
    height: 4rem;
    line-height: 4rem;
    border-radius: 0.5rem;
    background: #2f80ed;
    text-align: center;
    color: #fff;
    font-size: 1.3rem;
    cursor: pointer;
    margin-bottom: 0;
    transition: opacity 0.5s;
    user-select: none;
    &:hover{
      opacity: 0.8 !important;
    }
  }
`

const TestContainer = () => {
    // 使用useSearchParams-Hook监听url参数变化的customer Hook
    const {paramsJson, setNewParams} = useUrlParams(['moduleName', 'personId']);
    // 输入模块名值 Hook
    const [moduleName, setModuleName] = useState(paramsJson['moduleName'] || '');
    // 选中id值 Hook
    const [personId, setPersonId] = useState(parseInt(paramsJson['personId'] || '0'));
    // 列表数据集合 Hook
    const {array, add, clear, removeIndex} = useArray(personSelectList);
    // 个人信息context获取方法 context Hook
    // const {userInfo, loginOut} = useUserInfo();
    // 获取react-redux中loginOut触发方法
    const {userInfo, loginOut} = useAuth();
    // undo-reducer方法参数测试
    const {state, set, reset, undo, redo} = useUndo(0);
    // 路由跳转api指令方法 navigate Hook
    const navigate = useNavigate();
    // 初始化执行事件 useEffect的customer Hook
    useMount(useCallback(() => {
        removeIndex(1);
        add({name: '人', id: Math.random()*100});
    }, [removeIndex, add]));
    // 模块输入框输入事件监听
    const setModuleNameFunc = (value: string) => {
        setNewParams({moduleName: value});
        setModuleName(value);
    }
    // 选择框切换事件监听
    const setPersonIdFunc = (value: number) => {
        setNewParams({personId: String(value)});
        setPersonId(value);
    }
    // 登出事件
    const loginOutFunc = () => {
        // useContext方式实现登出
        // loginOut();
        // react-redux方式实现登出
        loginOut(null);
        navigate('/login');
    }
    return (
        <ContainerBox>
            {<div>name: {userInfo ? userInfo.name : ''}</div>}
            <SearchTab moduleName={moduleName} setModuleNameFunc={setModuleNameFunc}
                       personId={personId} setPersonIdFunc={setPersonIdFunc}/>
            <SearchTable moduleName={moduleName} personId={personId}/>
            <div>
                {array.map(res => <div key={res.id}>{res.name}</div>)}
            </div>
            <div onClick={(e): void => add({name: '人', id: Math.random() * 100})}>add</div>
            <div onClick={(e): void => clear()}>clear</div>
            <div onClick={(e): void => removeIndex(1)}>removeIndex</div>
            <p>当前值:{state}</p>
            <OperationBox>
                <p onClick={() => set(Math.random()*10)}>set</p>
                <p onClick={reset}>reset</p>
                <p onClick={undo}>undo</p>
                <p onClick={redo}>redo</p>
            </OperationBox>
            <LoginOutButton type={'ghost'} onClick={():void => loginOutFunc()}>退出</LoginOutButton>
            <TitleIconBox>
                <Outlet/>
            </TitleIconBox>
        </ContainerBox>
    )
}

export default TestContainer;