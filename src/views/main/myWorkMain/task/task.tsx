import HeaderBox from "../../../../components/main/myWorkMain/selectHeader";
import {Outlet} from "react-router-dom";
import styled from "@emotion/styled";

const TaskBox = styled.div`
`
const WorkMainRouterBox = styled.div`
  padding: 16px 24px;
  background: #fff;
`

const Task = () => {
    return (
        <TaskBox>
            <HeaderBox/>
            <WorkMainRouterBox>
                <Outlet/>
            </WorkMainRouterBox>
        </TaskBox>
    )
}

export default Task;