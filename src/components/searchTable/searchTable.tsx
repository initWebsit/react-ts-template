import { useState, useCallback } from 'react';
// import { list } from 'mock/test/test';
import { SearchTablePros } from "interface/searchTable/searchTable";
import {useDebounce} from "hook/common/common";
import { TableList } from "interface/common/common";
import { Table, Rate } from 'antd';

const SearchTable = ({moduleName, personId}: SearchTablePros) => {
    let initArr: TableList[] = [];
    const [arr, setArr] = useState(initArr);
    const getArr = useCallback(() => {
        // let array = list.concat([]);
        let testArray: TableList[] = window.localStorage.getItem('list') ?
            JSON.parse(window.localStorage.getItem('list') || '[]') : [];
        let array = testArray.concat([]);
        let value = array.filter((element) => {
            if (moduleName) {
                if ((element.moduleName === moduleName && element.personId === personId)
                || (element.moduleName === moduleName && personId === 0)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (personId === 0) {
                    return true;
                } else {
                    if (element.personId === personId) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        });
        setArr(value);
    }, [moduleName, personId]);
    useDebounce(getArr);
    const RateChange = (value: number, id: number) => {
        let index = arr.findIndex((element) => {
            if (element.id === id) {
                return true;
            } else {
                return false;
            }
        });
        if (index !== -1) {
            let arrTemplate = arr.concat([]);
            arrTemplate[index].collectStatus = value ? true : false;
            setArr(arrTemplate);
            // 修改localStorage中列表数据，应该arr是当前筛选过的数据不是全部数据
            let allLocalStorageList = JSON.parse(window.localStorage.getItem('list') || '[]');
            let storageIndex = allLocalStorageList.findIndex((element: TableList) => {
                if (element.id === id) {
                    return true;
                } else {
                    return false;
                }
            });
            allLocalStorageList[storageIndex].collectStatus = value ? true : false;
            window.localStorage.setItem('list', JSON.stringify(allLocalStorageList))
        }
    }
    const tableThArr = [
        {
            title: '收藏',
            dataIndex: 'collectStatus',
            key: 'collectStatus',
            render: (value: any, row: TableList) => {
                return <Rate count={1} value={row.collectStatus ? 1 : 0} onChange={(value) => RateChange(value, row.id)}/>
            }
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'PersonID',
            dataIndex: 'personId',
            key: 'personId'
        },
        {
            title: 'PersonName',
            dataIndex: 'personName',
            key: 'personName'
        },
        {
            title: 'ModuleName',
            dataIndex: 'moduleName',
            key: 'moduleName'
        }
    ];
    return (
        <Table dataSource={arr} columns={tableThArr}></Table>
    )
}

export default SearchTable;