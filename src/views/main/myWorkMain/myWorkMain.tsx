import styled from "@emotion/styled";
import {Outlet} from "react-router-dom";

const MyWorkMainBox = styled.div`
  position: relative;
  background: #fff;
  border-radius: 8px;
  margin-top: 16px;
  overflow: hidden;
`

const MyWorkMain = () => {
    return (
        <MyWorkMainBox>
            <Outlet/>
        </MyWorkMainBox>
    )
}

export default MyWorkMain;