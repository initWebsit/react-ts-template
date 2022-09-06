import React from 'react';
import styled from '@emotion/styled';
import Header from "../../components/main/header";
import {Outlet} from "react-router";

const MainBox = styled.div`
  position: relative;
  width: 100%;
  min-width: 128.8rem;
`
const MainBottomBox = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 1288px;
  padding: 64px 20px 0 20px;
`

const Main = () => {
    return (
        <MainBox>
            <Header/>
            <MainBottomBox>
                <Outlet/>
            </MainBottomBox>
        </MainBox>
    )
}

export default Main;