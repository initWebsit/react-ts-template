import { Spin } from 'antd';
import styled from '@emotion/styled';

const SpinBox = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const RouterLoading = () => {
    return (
        <SpinBox/>
    )
}
export default RouterLoading;