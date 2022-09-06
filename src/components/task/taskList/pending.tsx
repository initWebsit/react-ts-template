import React, {useCallback, useEffect, useState} from "react";
import {
    OperationSpan,
    OperationSpanBox, PaginationBox,
    TableBgBox,
    TableBox
} from "../../../utils/commonTableCss";
import EmptyContainer from "../../../components/common/emptyContainer";
import styled from "@emotion/styled";
import {throttle, useMountedRef} from "../../../hook/common/common";
import {getSubjectById} from "../../../utils/getSubjectStageGrade";
import {
    getReceivedWorkList,
    getReceivedWorkListType
} from "../../../api/main/myWorkMain/taskList/taskList";
import {WorkStatus, AssistantSpan} from "../../../views/main/myWorkMain/task/taskCompleted/taskCompleted";
import CommonIcon from "../../common/CommonIcon";
const throttleFunc = throttle();

const PendingBox = styled.div`
  
`;
const PendingTitle = styled.p`
  font-size: 16px;
  color: #333;
  line-height: 50px;
  font-weight: bold;
  margin: 0;
`;
const Pending = () => {
    // ref标记当前是否为unmounted已卸载状态
    const safeRef = useMountedRef();
    // 表格数据
    const [tableResultObj, setTableResultObj] = useState({
        tableData: [],
        totalSize: 0, // 数据总数
        pageSize: 10, // 一页多少数据
        currentPage: 1 // 当前页码
    });
    // 表格columns的配置
    const tableColumns = [
        {
            title: '任务编号',
            dataIndex: 'id',
            key: 'id',
            render: (id: number, record: any) => (
                <div>
                    {id}
                    <WorkStatus {...getStatusById(record.status, 1)}>
                        {getStatusById(record.status, 2)}</WorkStatus>
                </div>
            )
        },
        {
            title: '作业',
            dataIndex: 'section_name',
            key: 'section_name',
            render: (section_name: string, record: any) => (
                <div>
                    <span>{section_name}</span>
                    {
                        record.mark_type === 1 ?
                            <AssistantSpan>助教批改</AssistantSpan>
                            : null
                    }
                </div>
            )
        },
        {
            title: '领取时间',
            dataIndex: 'create_time',
            key: 'create_time'
        },
        {
            title: '学科',
            dataIndex: 'subject_id',
            key: 'subject_id',
            render: (subject_id: number) => (
                <>{getSubjectById(subject_id)}</>
            )
        },
        {
            title: '作业份数',
            dataIndex: 'homework_count',
            key: 'homework_count'
        },
        {
            title: '操作',
            render: () => (
                <OperationSpanBox>
                    <CommonIcon className={'iconfont iconpigaiicon'}/>
                    <OperationSpan>批改作业</OperationSpan>
                </OperationSpanBox>
            )
        }
    ];

    // 获取任务状态方法
    const getStatusById = useCallback((status: number, type: number) => {
        if (type === 1) {
            let workStatus1 = {
                backgroundColor: 'rgba(248, 228, 255, 0.8)',
                borderColor: '#BE00FF',
                color: '#BE00FF'
            };
            let workStatus2 = {
                backgroundColor: '#FFF1F0',
                borderColor: '#FF443A',
                color: '#FF443A'
            };
            switch (status) {
                case 0:
                    return workStatus1;
                case 1:
                    return workStatus1;
                case 2:
                    return workStatus1;
                case 3:
                    return workStatus2;
                case 4:
                    return workStatus2;
                case 5:
                    return workStatus2;
                case 6:
                    return workStatus2;
                default:
                    return workStatus1;
            }
        } else {
            switch (status) {
                case 0:
                    return '未处理';
                case 1:
                    return '处理中';
                case 2:
                    return '处理完';
                case 3:
                    return '被退回';
                case 4:
                    return '已回收';
                case 5:
                    return '覆盖';
                case 6:
                    return '已超时';
                default:
                    return '未处理';
            }
        }
    }, []);

    // 获取表格数据方法
    const getTableData = useCallback((callback: () => void) => {
        let data: getReceivedWorkListType = {
            task_type: 1,
            page: tableResultObj.currentPage,
            pagesize: tableResultObj.pageSize,
            loading: document.getElementsByClassName('PendingBox')[0]
        };
        getReceivedWorkList(data).then((res: any) => {
            // 如果当前为不安全状态(组件已卸载状态)，则不进行下一步处理
            if (safeRef.current === 0) {
                callback();
                return false;
            }
            if (res.code === 10000) {
                setTableResultObj((pre) => {
                    return {
                        ...pre,
                        totalSize: res.data.meta.total,
                        tableData: res.data.items.map((res: any, index: number) => {return {...res, key: index, index: index}})
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
    }, [tableResultObj.currentPage, tableResultObj.pageSize, safeRef]);
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
        <PendingBox className={'PendingBox'}>
            {
                tableResultObj.totalSize > 0 ?
                    <>
                        <PendingTitle>处理中任务:</PendingTitle>
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
                    </>
                    : null
            }
        </PendingBox>
    )
}

export default Pending;