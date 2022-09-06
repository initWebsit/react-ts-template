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
    getWorkList,
    getWorkListType
} from "../../../api/main/myWorkMain/taskList/taskList";
import CommonIcon from "../../common/CommonIcon";
const throttleFunc = throttle();

const UnclaimedBox = styled.div`
  
`;
const UnclaimedTitle = styled.p`
  font-size: 16px;
  color: #333;
  line-height: 50px;
  font-weight: bold;
  margin: 0;
`;
const Unclaimed = () => {
    // ref标记当前是否为unmounted已卸载状态
    const safeRef = useMountedRef();
    // 表格数据
    const [tableResultObj, setTableResultObj] = useState({
        tableData: [],
        totalSize: 1, // 数据总数
        pageSize: 10, // 一页多少数据
        currentPage: 1 // 当前页码
    });
    // 表格columns的配置
    const tableColumns = [
        {
            title: '学科',
            dataIndex: 'subject_id',
            key: 'subject_id',
            render: (subject_id: number) => (
                <>{getSubjectById(subject_id)}</>
            )
        },
        {
            title: '作业',
            dataIndex: 'section_name',
            key: 'section_name',
            render: (section_name: string) => (
                <div>
                    <span>{section_name}</span>
                </div>
            )
        },
        {
            title: '单份作业客观题题量',
            dataIndex: 'objective_question_total',
            key: 'objective_question_total'
        },
        {
            title: '单份作业客观题题量',
            dataIndex: 'subjective_question_total',
            key: 'subjective_question_total'
        },
        {
            title: '操作',
            render: () => (
                <OperationSpanBox>
                    <CommonIcon className={'iconfont iconpigaiicon'}/>
                    <OperationSpan>领取任务</OperationSpan>
                </OperationSpanBox>
            )
        }
    ];

    // 获取表格数据方法
    const getTableData = useCallback((callback: () => void) => {
        let data: getWorkListType = {
            page: tableResultObj.currentPage,
            pagesize: tableResultObj.pageSize,
            loading: document.getElementsByClassName('UnclaimedBox')[0]
        };
        getWorkList(data).then((res: any) => {
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
        <UnclaimedBox className={'UnclaimedBox'}>
            <UnclaimedTitle>待处理任务:</UnclaimedTitle>
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
        </UnclaimedBox>
    )
}

export default Unclaimed;