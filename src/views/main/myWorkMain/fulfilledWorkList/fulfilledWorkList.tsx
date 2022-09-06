import React, {useCallback, useEffect, useState} from "react";
import {
    OperationSpan,
    OperationSpanBox,
    PaginationBox,
    TableBgBox,
    TableBox
} from "../../../../utils/commonTableCss";
import CommonIcon from "../../../../components/common/CommonIcon";
import EmptyContainer from "../../../../components/common/emptyContainer";
import styled from "@emotion/styled";
import {throttle, useMountedRef} from "../../../../hook/common/common";
import {teacherHomeworkDetail, teacherHomeworkDetailType} from "../../../../api/main/myWorkMain/fulfilledWorkList/fulfilledWorkList";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getSubjectById} from "../../../../utils/getSubjectStageGrade";
const throttleFunc = throttle();

const StatusSpan = styled.div`
  font-size: 14px;
  color: #888;
  &::before{
    content: "-";
    display: inline-block;
    width: 8px;
    height: 8px;
    line-height: 8px;
    border-radius: 50%;
    margin-right: 10px;
    background: ${({backgroundColor, color}: {backgroundColor: string, color: string}) => backgroundColor};
    color: ${({backgroundColor, color}: {backgroundColor: string, color: string}) => color};
  }
`

const FulFilledWorkListBox = styled.div`
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
`

const TaskInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  & > p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    font-size: 16px;
    &>span:nth-of-type(1){
      color: #333;
      font-weight: 700;
      margin-right: 10px;
    }
    &>span:nth-of-type(2){
      color: #888;
    }
  }
`

const FulfilledWorkList = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    // ref标记当前是否为unmounted已卸载状态
    const safeRef = useMountedRef();
    // 表格数据
    const [tableResultObj, setTableResultObj] = useState({
        tableData: [],
        totalSize: 1, // 数据总数
        pageSize: 10, // 一页多少数据
        currentPage: 1 // 当前页码
    });
    const [taskInfo, setTaskInfo] = useState({
        number: 0,
        subject: '-',
        section_name: '-',
        time: '-'
    });
    // 表格columns的配置
    const tableColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index'
        },
        {
            title: '作业',
            dataIndex: 'section_name',
            key: 'section_name',
            render: (section_name: string, record: any) => (
                <div>
                    <span>{section_name}</span>
                </div>
            )
        },
        {
            title: '班级',
            dataIndex: 'class_name',
            key: 'class_name'
        },
        {
            title: '学生',
            dataIndex: 'student_name',
            key: 'student_name'
        },
        {
            title: '学码',
            dataIndex: 'student_code',
            key: 'student_code'
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time'
        },
        {
            title: '作业状态',
            dataIndex: 'cover_status',
            key: 'cover_status',
            render: (cover_status: number) => (
                <div>
                    <StatusSpan {...getStatusById(cover_status)}>{getStatusTextById(cover_status)}</StatusSpan>
                </div>
            )
        },
        {
            title: '操作',
            render: (columns: any, rows: any) => (
                <OperationSpanBox>
                    <CommonIcon className={'iconfont iconyanjinglan1'}/>
                    <OperationSpan onClick={() => lookDetail(rows.id, rows.section_name, rows.student_name, rows.modified_time)}>查看</OperationSpan>
                </OperationSpanBox>
            )
        }
    ];

    // 获取任务状态方法
    const getStatusById = useCallback((status: number) => {
        let workStatus1 = {
            backgroundColor: '#24DB5A',
            color: '#24DB5A'
        };
        let workStatus2 = {
            backgroundColor: '#FF443A',
            color: '#FF443A'
        };
        switch (status) {
            case 0:
                return workStatus1;
            case 1:
                return workStatus2;
            default:
                return workStatus1;
        }
    }, []);
    const getStatusTextById = useCallback((status: number) => {
        switch (status) {
            case 0:
                return '正常';
            case 1:
                return '覆盖';
            default:
                return '正常';
        }
    }, []);

    const lookDetail = useCallback((meta_data_id: number, section_name: string, student_name: string, modified_time: string) => {
        navigate(`/main/myWorkMain/correctResult?task_id=${params.get('id')}&id=${meta_data_id}&section_name=${section_name}&student_name=${student_name}&modified_time=${modified_time}`);
    }, [navigate, params]);

    // 获取表格数据方法
    const getTableData = useCallback((callback: () => void) => {
        let data: teacherHomeworkDetailType = {
            task_id: parseInt(params.get('id') || '0'),
            page: tableResultObj.currentPage,
            pagesize: tableResultObj.pageSize,
            loading: document.getElementsByClassName('fulfilledWorkListBox')[0]
        };
        teacherHomeworkDetail(data).then((res: any) => {
            // 如果当前为不安全状态(组件已卸载状态)，则不进行下一步处理
            if (safeRef.current === 0) {
                callback();
                return false;
            }
            if (res.code === 10000) {
                setTaskInfo((pre) => {
                    return {
                        ...pre,
                        number: res.data.homework_info.id,
                        subject: getSubjectById(res.data.homework_info.subject_id),
                        section_name: res.data.homework_info.section_name,
                        time: res.data.homework_info.modified_time
                    }
                });
                setTableResultObj((pre) => {
                    return {
                        ...pre,
                        totalSize: res.data.homework_list.length,
                        tableData: res.data.homework_list.map((res: any, index: number) => {return {...res, key: index, index: index}})
                    }
                });
            } else {
                setTableResultObj((pre) => {
                    return {
                        ...pre,
                        tableData: [],
                        currentPage: 1,
                        totalSize: 0
                    }
                });
            }
            callback();
        }).catch(() => {
            setTableResultObj((pre) => {
                return {
                    ...pre,
                    tableData: [],
                    currentPage: 1,
                    totalSize: 0
                }
            });
            callback();
        });
    }, [tableResultObj.currentPage, tableResultObj.pageSize, params, safeRef]);
    // pageSize或page改变触发事件
    const pageChange = useCallback((page: number, pageSize: number) => {
        setTableResultObj((pre) => {
            return {
                ...pre,
                currentPage: page,
                pageSize: pageSize
            }
        });
    }, []);
    // 初始化获取表格信息 与 如下
    // 监听学科选择改变，日期选择改变，页码选择改变触发事件
    // （因为需要根据最新state状态值请求table数据，所以必须使用useEffect进行生命周期管理-监听
    // :以后逻辑同理，此为与class component最大的区别）
    useEffect(() => {
        throttleFunc(getTableData);
    }, [tableResultObj.pageSize, tableResultObj.currentPage, getTableData]);
    return (
        <FulFilledWorkListBox className={'fulfilledWorkListBox'}>
            <TaskInfoBox>
                <p>
                    <span>任务编号:</span>
                    <span>{taskInfo.number}</span>
                </p>
                <p>
                    <span>学科:</span>
                    <span>{taskInfo.subject}</span>
                </p>
                <p>
                    <span>作业章节:</span>
                    <span>{taskInfo.section_name}</span>
                </p>
                <p>
                    <span>提交时间:</span>
                    <span>{taskInfo.time}</span>
                </p>
            </TaskInfoBox>
            {
                tableResultObj.totalSize > 0 ?
                    <TableBgBox>
                        <TableBox pagination={false} dataSource={tableResultObj.tableData} columns={tableColumns}/>
                        {
                            tableResultObj.totalSize/tableResultObj.pageSize > 1 ?
                                <PaginationBox
                                    showSizeChanger
                                    onChange={pageChange}
                                    current={tableResultObj.currentPage}
                                    pageSize={tableResultObj.pageSize}
                                    total={tableResultObj.totalSize}
                                />
                                : null
                        }
                    </TableBgBox>
                    : <EmptyContainer/>
            }
        </FulFilledWorkListBox>
    )
}

export default FulfilledWorkList;