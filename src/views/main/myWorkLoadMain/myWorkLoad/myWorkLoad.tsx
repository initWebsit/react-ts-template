import React, {useCallback, useEffect, useState} from 'react';
import {Select, DatePicker} from 'antd';
import moment, {Moment} from 'moment';
import {subjectOption} from "../../../../utils/subject_stage";
import {getSubjectById} from "../../../../utils/getSubjectStageGrade";
import {RangeValue} from "_rc-picker@2.6.4@rc-picker/lib/interface";
import {getMyWorkloadList, LoginType} from "../../../../api/main/myWorkLoadMain/myWorkLoadMain";
import {throttle, useMountedRef} from "../../../../hook/common/common";
import CommonIcon from "../../../../components/common/CommonIcon";
import EmptyContainer from "../../../../components/common/emptyContainer";
import {WorkLoadBox, TableBgBox, TableBox, PaginationBox, OperationSpan, OperationSpanBox} from '../../../../utils/commonTableCss';
import {useNavigate} from "react-router-dom";
const throttleFunc = throttle();

// interface workColumnsType {
//     title: string,
//     dataIndex: string,
//     key: string
// }

const MyWorkLoad = () => {
    const navigate = useNavigate();
    // ref标记当前是否为unmounted已卸载状态
    const safeRef = useMountedRef();
    // 选择学科
    const [selectSubject, setSelectSubject] = useState('');
    // 选择日期
    const [selectDate, setSelectDate] = useState<RangeValue<Moment>>([moment(new Date().getTime() - 30*24*60*60*1000), moment()]);
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
                <>
                    {getSubjectById(subject_id)}
                </>
            ),
        },
        {
            title: '任务量',
            dataIndex: 'task_count',
            key: 'task_count'
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
                    {(objective_rate*100).toFixed(2)}
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
                    {(subjective_rate*100).toFixed(2)}
                </>
            )
        },
        {
            title: '作文量',
            dataIndex: 'composition_modification_total',
            key: 'composition_modification_total'
        },
        {
            title: '作文修改率',
            dataIndex: 'composition_rate',
            key: 'composition_rate',
            render: (composition_rate: number) => (
                <>
                    {(composition_rate*100).toFixed(2)}
                </>
            )
        },
        {
            title: '超时次数',
            dataIndex: 'timeout_times',
            key: 'timeout_times'
        },
        {
            title: '被抽查',
            dataIndex: 'survey_times',
            key: 'survey_times'
        },
        {
            title: '不合格',
            dataIndex: 'disqualified_times',
            key: 'disqualified_times'
        },
        {
            title: '操作',
            dataIndex: 'task_ids',
            key: 'task_ids',
            render: (columns: string, rows: any) => (
                <OperationSpanBox>
                    <CommonIcon className={'iconfont iconyanjinglan1'}/>
                    <OperationSpan onClick={() => lookDetail(rows.task_ids, rows.section_ids)}>查看详情</OperationSpan>
                </OperationSpanBox>
            )
        }
    ];

    // 获取表格数据方法
    const getTableData = useCallback((callback: () => void) => {
        let data: LoginType = {
            subject_id: selectSubject,
            page: tableResultObj.currentPage,
            pagesize: tableResultObj.pageSize,
            loading: document.getElementsByClassName('workLoadBox')[0],
            start_time: selectDate ? selectDate[0]?.format('YYYY-MM-DD'): '',
            end_time: selectDate && selectDate[1] ? selectDate[1]?.format('YYYY-MM-DD'): ''
        };
        getMyWorkloadList(data).then((res) => {
            // 如果当前为不安全状态(组件已卸载状态)，则不进行下一步处理
            if (safeRef.current === 0) {
                callback();
                return false;
            }
            if (res.code === 10000) {
                setTableResultObj((pre) => {
                    return {
                        ...pre,
                        totalSize: res.data.assistant_task_data.length,
                        tableData: res.data.assistant_task_data.map((res: any, index: number) => {return {...res, key: index}})
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
    }, [selectSubject, selectDate, tableResultObj.currentPage, tableResultObj.pageSize, safeRef]);
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
    // 学科选择改变触发事件
    const setSelectSubjectFunc = useCallback((value: string) => {
        setSelectSubject(value);
    }, []);
    // pageSize或page改变触发事件
    const setSelectDateFunc = useCallback((date: RangeValue<Moment>) => {
        setSelectDate(date);
    }, []);
    // 重置按钮点击事件
    const reset = useCallback(() => {
        setSelectSubject('');
        setSelectDate([moment(new Date().getTime() - 30*24*60*60*1000), moment()]);
    }, []);
    // 查看详情点击事件
    const lookDetail = useCallback((task_ids: string, section_ids: string) => {
        navigate(`/main/myWorkLoadMain/myWorkLoadDetail?task_ids=${task_ids}&section_ids=${section_ids}`);
    }, [navigate]);
    // 初始化获取表格信息 与 如下
    // 监听学科选择改变，日期选择改变，页码选择改变触发事件
    // （因为需要根据最新state状态值请求table数据，所以必须使用useEffect进行生命周期管理-监听
    // :以后逻辑同理，此为与class component最大的区别）
    useEffect(() => {
        throttleFunc(getTableData);
    }, [selectSubject, selectDate, tableResultObj.pageSize, tableResultObj.currentPage, getTableData]);
    return (
        <WorkLoadBox className={'workLoadBox'}>
            <div className={'searchBox'}>
                <div className={'inputBox'}>
                    <span>选中学科:</span>
                    <Select className={'inputSelector'} value={selectSubject} onChange={(value) => setSelectSubjectFunc(value)}>
                        {
                            subjectOption.map((res) =>
                                <Select.Option key={res.value} value={res.value}>{res.label}</Select.Option>
                            )
                        }
                    </Select>
                </div>
                <div className={'inputBox'}>
                    <span>选择日期:</span>
                    <DatePicker.RangePicker allowClear={false} className={'dateSelector'} value={selectDate} onChange={(date) => setSelectDateFunc(date)}/>
                </div>
                <p className={'commonButton'} onClick={() => throttleFunc(getTableData)}>确定</p>
                <p className={'commonButton reset'} onClick={() => reset()}>重置</p>
            </div>
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
        </WorkLoadBox>
    )
}

export default MyWorkLoad;