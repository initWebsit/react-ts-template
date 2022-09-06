import {useCallback} from 'react';
import styled from '@emotion/styled';
import {useLocation} from "react-router";
import {useNavigate} from "react-router-dom";

const HeaderBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #eee;
  p{
    margin: 0;
    width: 102px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  &>p:nth-of-type(1){
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  &>p:nth-of-type(2){
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  & > .selected{
    border: 1px solid #1890FF;
    background: #e6f1fc;
    color: #1890ff;
  }
`

const SelectHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const selectTaskFunc = useCallback((type: number) => {
        if (type === 1 && location.pathname !== '/main/myWorkMain/task/taskList') {
            navigate('taskList');
        } else if (type === 2 && location.pathname !== '/main/myWorkMain/task/taskCompleted') {
            navigate('taskCompleted');
        }
    }, [navigate, location]);

    return (
        <HeaderBox>
            <p className={`${location.pathname === '/main/myWorkMain/task/taskList' ? 'selected' : ''}`}
               onClick={() => selectTaskFunc(1)}>任务列表</p>
            <p className={`${location.pathname === '/main/myWorkMain/task/taskCompleted' ? 'selected' : ''}`}
               onClick={() => selectTaskFunc(2)}>已完成任务</p>
        </HeaderBox>
    )
}

export default SelectHeader;