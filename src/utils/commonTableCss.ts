import styled from "@emotion/styled";
import {Pagination, Table} from "antd";

export const WorkLoadBox = styled.div`
  position: relative;
  background: #fff;
  border-radius: 8px;
  margin-top: 16px;
  padding: ${({noPadding}: {noPadding?: boolean}) => noPadding ? '0px' : '20px 26px'};
  .searchBox{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .inputBox{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 30px;
      & > span{
        margin-right: 10px;
      }
      .inputSelector{
        width: 100px;
      }
      .dateSelector{
        width: 300px;
      }
    }
    .commonButton{
      width: 80px;
      margin: 0 0 0 8px;
      display: inline-block;
      background: #1890ff;
      color: #fff;
      font-size: 14px;
      padding: 6px 13px;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      transition: all .3s;
      text-align: center;
      &:hover{
        opacity: 0.8;
      }
    }
    .reset{
      color: #888;
      font-size: 14px;
      background: #fff;
      border: 1px solid #d9d9d9;
      text-align: center;
    }
  }
`
export const TableBgBox = styled.div`
  height: calc(100vh - 250px);
  overflow-y: auto;
  background: #fff;
`
export const TableBox = styled(Table)`
`
export const PaginationBox = styled(Pagination)`
  margin-top: 20px;
  text-align: right;
`

export const OperationSpan = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #1890ff;
  cursor: pointer;
  margin-left: 6px;
  &:hover{
    text-decoration-line: underline;
  }
`

export const OperationSpanBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #1890ff;
  cursor: pointer;
`