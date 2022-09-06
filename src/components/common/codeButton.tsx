import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled';

const CodeButtonBox = styled.div`
  width: 10rem;
  height: 100%;
  line-height: 4rem;
  font-size: 1.4rem;
  color: #fff;
  cursor: pointer;
`

const CodeButton = React.memo(({status, setStatus}: {status: boolean, setStatus: (status: boolean) => void}) => {
    const [timeNumber, setTimeNumber] = useState(0);
    useEffect(() => {
        if (status) {
            const timer = setInterval(() => {
                setTimeNumber((pre) => {
                    if (pre <= 1) {
                        clearInterval(timer);
                        setTimeout(() => {setStatus(false);}, 100);
                    }
                    return pre - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setTimeNumber(60);
        }
    }, [status, setTimeNumber, setStatus])
    return (
        status ?
            <CodeButtonBox>{timeNumber}</CodeButtonBox>
            :
            <CodeButtonBox>获取验证码</CodeButtonBox>
    )
});

export default CodeButton;