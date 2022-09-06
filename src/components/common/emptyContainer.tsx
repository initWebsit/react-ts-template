import styled from '@emotion/styled';
import NoDataImg from '../../assets/images/common/nodata.png';

const NoAppoint = styled.div`
  margin: 12vh 0;
  text-align: center;
  font-size: 14px;
  color: #999;
  line-height: 30px;
  img{
    max-width: 250px;
  }
  p{
    margin: 0;
  }
`

const EmptyContainer = () => {
    return (
        <NoAppoint>
            <p><img src={NoDataImg} alt={'noData'}/></p>
            <p>暂无该条件任务哦~~</p>
        </NoAppoint>
    )
}

export default EmptyContainer;