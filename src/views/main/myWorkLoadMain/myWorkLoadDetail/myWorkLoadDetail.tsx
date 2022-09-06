import React, {useCallback, useEffect, useState} from "react";
import {
    PaginationBox,
    TableBgBox,
    TableBox
} from "../../../../utils/commonTableCss";
import EmptyContainer from "../../../../components/common/emptyContainer";
import styled from "@emotion/styled";
import {throttle, useMountedRef} from "../../../../hook/common/common";
import {useSearchParams} from "react-router-dom";
import {getSubjectById} from "../../../../utils/getSubjectStageGrade";
import {
    getWorkloadDetail,
    getWorkloadDetailType
} from "../../../../api/main/myWorkLoadMain/myWorkLoadDetail/myWorkLoadDetail";
const throttleFunc = throttle();

const MyWorkLoadDetailBox = styled.div`
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  margin-top: 16px;
`

const MyWorkLoadDetail = () => {
    const [params] = useSearchParams();
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
            title: '任务编号',
            dataIndex: 'task_id',
            key: 'task_id'
        },
        {
            title: '学科',
            dataIndex: 'subject_id',
            key: 'subject_id',
            render: (subject_id: number) => (
                <>
                    {getSubjectById(subject_id)}
                </>
            )
        },
        {
            title: '作业量',
            dataIndex: 'homework_count',
            key: 'homework_count'
        },
        {
            title: '客观题量',
            dataIndex: 'objective_count',
            key: 'objective_count'
        },
        {
            title: '客观题修改率',
            dataIndex: 'objective_rate',
            key: 'objective_rate',
            render: (objective_rate: number) => (
                <>
                    {(objective_rate*100).toFixed(2)}%
                </>
            )
        },
        {
            title: '主观题量',
            dataIndex: 'subjective_count',
            key: 'subjective_count'
        },
        {
            title: '主观题修改率',
            dataIndex: 'subjective_rate',
            key: 'subjective_rate',
            render: (subjective_rate: number) => (
                <>
                    {(subjective_rate*100).toFixed(2)}%
                </>
            )
        },
        {
            title: '作文量',
            dataIndex: 'composition_count',
            key: 'composition_count'
        },
        {
            title: '作文修改率',
            dataIndex: 'composition_rate',
            key: 'composition_rate',
            render: (composition_rate: number) => (
                <>
                    {(composition_rate*100).toFixed(2)}%
                </>
            )
        },
        {
            title: '是否超时',
            dataIndex: 'overtime',
            key: 'overtime'
        },
        {
            title: '覆盖数量',
            dataIndex: 'cover_count',
            key: 'cover_count'
        },
        {
            title: '退回次数',
            dataIndex: 'return_count',
            key: 'return_count'
        }
    ];

    // 获取表格数据方法
    const getTableData = useCallback((callback: () => void) => {
        let data: getWorkloadDetailType = {
            task_ids: parseInt(params.get('task_ids') || '0'),
            section_ids: params.get('section_ids') || '',
            page: tableResultObj.currentPage,
            pagesize: tableResultObj.pageSize,
            loading: document.getElementsByClassName('MyWorkLoadDetailBox')[0]
        };
        getWorkloadDetail(data).then((res: any) => {
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
        <MyWorkLoadDetailBox className={'MyWorkLoadDetailBox'}>
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
        </MyWorkLoadDetailBox>
    )
}

export default MyWorkLoadDetail;