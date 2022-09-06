import React, {useCallback, useEffect, useState} from "react";
import {Image} from 'antd';
import {
    TableBgBox,
    TableBox
} from "../../../../utils/commonTableCss";
import CommonIcon from "../../../../components/common/CommonIcon";
import EmptyContainer from "../../../../components/common/emptyContainer";
import styled from "@emotion/styled";
import {throttle, useMountedRef} from "../../../../hook/common/common";
import {correctDetail, correctDetailType} from "../../../../api/main/myWorkMain/correctResult/correctResult";
import {useSearchParams} from "react-router-dom";
const throttleFunc = throttle();

const FulFilledWorkListBox = styled.div`
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  .resultBox{
    font-size: 15px;
    //color: #ff6a00;
    line-height: 50px;
    font-weight: bold;
    .iconcuo2{
      font-size: 30px;
      color: rgb(244, 51, 60);
    }
    .iconbanduibancuo2{
      font-size: 30px;
      color: rgb(36, 219, 90);
    }
    .icondui{
      font-size: 30px;
      color: rgb(36, 219, 90);
    }
  }
`

const TaskCorrectTitle = styled.p`
  color: #333;
  font-size: 18px;
  margin-bottom: 16px;
`

const WorkImg = styled(Image)`
  width: 350px;
  cursor: pointer;
`

const TaskInfoBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 12px;
  & > p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 64px 0 0;
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

const CorrectResult = () => {
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
            title: '题号',
            dataIndex: 'question_num',
            key: 'question_num'
        },
        {
            title: '作答切图',
            dataIndex: 'question_image_url',
            key: 'question_image_url',
            width: 350,
            render: (question_image_url: string) => (
                <>
                    <WorkImg width={350} src={question_image_url} alt={'作业切图'}/>
                </>
            )
        },
        {
            title: '识别结果',
            dataIndex: 'goods_type',
            key: 'goods_type',
            render: (columns: number, rows: any) => (
                <div>
                    {getScanResult(rows.children_question_info)}
                </div>
            )
        },
        {
            title: '我的核对结果',
            dataIndex: 'goods_type',
            key: 'goods_type',
            render: (columns: number, rows: any) => (
                <div>
                    {getCorrectResult(rows.children_question_info)}
                </div>
            )
        },
        {
            title: '管理员修改',
            dataIndex: 'goods_type',
            key: 'goods_type',
            render: (columns: number, rows: any) => (
                <div>
                    {getManageResult(rows.children_question_info)}
                </div>
            )
        }
    ];

    // 格式化识别结果
    const getScanResult = useCallback((arr: any[]) => {
        const element = arr.map((res, index) => (
            res.children_analyze_type === 0 ?
                <div key={index} className="resultBox">{res.children_analyze_result ? res.children_analyze_result : '未批改'}</div>
                : res.children_analyze_type === 1 ?
                <div key={index} className="resultBox">{res.children_analyze_result !== '' ? res.children_analyze_result : '未批改'}</div>
                : res.children_analyze_type === 2 ?
                    (
                        res.children_analyze_result === '0' ?
                            <div key={index} className="resultBox"><CommonIcon className="iconfont iconcuo2"></CommonIcon></div>
                            : res.children_analyze_result === '1' ?
                            <div key={index} className="resultBox"><CommonIcon className="iconfont iconbanduibancuo2"></CommonIcon></div>
                            : res.children_analyze_result === '2' ?
                                <div key={index} className="resultBox"><CommonIcon className="iconfont icondui"></CommonIcon></div>
                                : <div key={index} className="resultBox">未批改</div>
                    )
                    : null
        ));
        return element;
    }, []);

    // 获取助教批改结果
    const getCorrectResult = useCallback((arr: any[]) => {
        const element = arr.map((res, index) => (
            res.hasOwnProperty('old_mark_analyze_result') ?
                (
                    res.children_analyze_type === 0 ?
                        <div key={index} className="resultBox">{res.old_mark_analyze_result ? res.old_mark_analyze_result : '未批改'}</div>
                        : res.children_analyze_type === 1 ?
                        <div key={index} className="resultBox">{res.old_mark_analyze_result !== '' ? res.old_mark_analyze_result : '未批改'}</div>
                        : res.children_analyze_type === 2 ?
                            (
                                res.old_mark_analyze_result === '0' ?
                                    <div key={index} className="resultBox"><CommonIcon className="iconfont iconcuo2"></CommonIcon></div>
                                    : res.old_mark_analyze_result === '1' ?
                                    <div key={index} className="resultBox"><CommonIcon className="iconfont iconbanduibancuo2"></CommonIcon></div>
                                    : res.old_mark_analyze_result === '2' ?
                                        <div key={index} className="resultBox"><CommonIcon className="iconfont icondui"></CommonIcon></div>
                                        : <div key={index} className="resultBox">未批改</div>
                            )
                            : null
                )
                :
                (
                    res.children_analyze_type === 0 ?
                        <div key={index} className="resultBox">{res.mark_analyze_result ? res.mark_analyze_result : '未批改'}</div>
                        : res.children_analyze_type === 1 ?
                        <div key={index} className="resultBox">{res.mark_analyze_result !== '' ? res.mark_analyze_result : '未批改'}</div>
                        : res.children_analyze_type === 2 ?
                            (
                                res.mark_analyze_result === '0' ?
                                    <div key={index} className="resultBox"><CommonIcon className="iconfont iconcuo2"></CommonIcon></div>
                                    : res.mark_analyze_result === '1' ?
                                    <div key={index} className="resultBox"><CommonIcon className="iconfont iconbanduibancuo2"></CommonIcon></div>
                                    : res.mark_analyze_result === '2' ?
                                        <div key={index} className="resultBox"><CommonIcon className="iconfont icondui"></CommonIcon></div>
                                        : <div key={index} className="resultBox">未批改</div>
                            )
                            : null
                )
        ));
        return element;
    }, []);

    // 获取管理员批改结果
    const getManageResult = useCallback((arr: any[]) => {
        const element = arr.map((res, index) => (
            res.manageEdit !== '无数据' ?
                (
                    res.children_analyze_type === 0 ?
                        <div key={index} className="resultBox">{res.manageEdit ? res.manageEdit : '未批改'}</div>
                        : res.children_analyze_type === 1 ?
                        <div key={index} className="resultBox">{res.manageEdit !== '' ? res.manageEdit : '未批改'}</div>
                        : res.children_analyze_type === 2 ?
                            (
                                res.manageEdit === '0' ?
                                    <div key={index} className="resultBox"><CommonIcon className="iconfont iconcuo2"></CommonIcon></div>
                                    : res.manageEdit === '1' ?
                                    <div key={index} className="resultBox"><CommonIcon className="iconfont iconbanduibancuo2"></CommonIcon></div>
                                    : res.manageEdit === '2' ?
                                        <div key={index} className="resultBox"><CommonIcon className="iconfont icondui"></CommonIcon></div>
                                        : <div key={index} className="resultBox">未批改</div>
                            )
                            : null
                )
                :
                (
                    <div className="resultBox">未修改</div>
                )
        ));
        return element;
    }, []);

    // 获取表格数据方法
    const getTableData = useCallback((callback: () => void) => {
        let data: correctDetailType = {
            task_id: parseInt(params.get('task_id') || '0'),
            meta_data_id: parseInt(params.get('id') || '0'),
            page: tableResultObj.currentPage,
            pagesize: tableResultObj.pageSize,
            loading: document.getElementsByClassName('correctResultBox')[0]
        };
        correctDetail(data).then((res: any) => {
            // 如果当前为不安全状态(组件已卸载状态)，则不进行下一步处理
            if (safeRef.current === 0) {
                callback();
                return false;
            }
            if (res.code === 10000) {
                let arr: any[] = [];
                res.data.scan_data.forEach((res: any) => {
                    arr = arr.concat(res.question_info);
                });
                /* 在已扁平化的作业数据中-初始化设置管理员批改数据 */
                arr.forEach((data) => {
                    data.children_question_info.forEach((response: any) => {
                        if (response.hasOwnProperty('old_mark_analyze_result')) {
                            response.manageEdit = response.mark_analyze_result;
                        } else {
                            response.manageEdit = '无数据';
                        }
                    });
                    data.question_image_url = `${data.question_image_url}?time=${new Date().getTime()}`;
                });
                setTableResultObj((pre) => {
                    return {
                        ...pre,
                        totalSize: arr.length,
                        tableData: arr.map((res: any, index: number) => {return {...res, key: index, index: index}}) as never[]
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
    // 初始化获取表格信息 与 如下
    // 监听学科选择改变，日期选择改变，页码选择改变触发事件
    // （因为需要根据最新state状态值请求table数据，所以必须使用useEffect进行生命周期管理-监听
    // :以后逻辑同理，此为与class component最大的区别）
    useEffect(() => {
        throttleFunc(getTableData);
    }, [tableResultObj.pageSize, tableResultObj.currentPage, getTableData]);
    return (
        <FulFilledWorkListBox className={'correctResultBox'}>
            <TaskCorrectTitle>作业批改结果:</TaskCorrectTitle>
            <TaskInfoBox>
                <p>
                    <span>作业章节:</span>
                    <span>{params.get('section_name') || ''}</span>
                </p>
                <p>
                    <span>学生:</span>
                    <span>{params.get('student_name') || ''}</span>
                </p>
                <p>
                    <span>提交时间:</span>
                    <span>{params.get('modified_time') || ''}</span>
                </p>
            </TaskInfoBox>
            {
                tableResultObj.totalSize > 0 ?
                    <TableBgBox>
                        <TableBox pagination={false} dataSource={tableResultObj.tableData} columns={tableColumns}/>
                    </TableBgBox>
                    : <EmptyContainer/>
            }
        </FulFilledWorkListBox>
    )
}

export default CorrectResult;