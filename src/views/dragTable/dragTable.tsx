import styled from '@emotion/styled';
import {useState, useCallback} from "react";
import {useMount} from "../../hook/common/common";

const DragTableBox = styled.div`
  width: 800px;
  margin: 20px auto;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px #aaa;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ListBox = styled.div`
  width: 45%;
  border: 1px solid #aaa;
  padding: 10px;
  &>.list{
    width: 100%;
    height: 60px;
    line-height: 60px;
    border-radius: 5px;
    margin-top: 10px;
    padding: 0 10px;
    box-shadow: 0 0 5px #9a6e3a;
    user-select: none;
    //animation: listAdd 0.2s forwards;
  }
  &>.removeList{
    animation: listRemove 0.2s forwards;
  }
  &>.addList{
    animation: listAdd 0.2s forwards;
  }
  &>.addListEmpty{
    animation: listAddEmpty 0.2s forwards;
  }
`

interface tableArrType {
    id: number,
    name: number,
    nodeRemoveAddStatus?: number // 1-移除 2-新增 3-新增(新增节点但是显示空内容opacity: 0)
}

const initialArr = [
    {
        id: 1,
        name: 1
    },
    {
        id: 2,
        name: 2
    },
    {
        id: 3,
        name: 3
    },
    {
        id: 4,
        name: 4
    }
];
const initialArrTwo = [
    {
        id: 5,
        name: 5
    },
    {
        id: 6,
        name: 6
    },
    {
        id: 7,
        name: 7
    },
    {
        id: 8,
        name: 8
    }
];

const DragTable = () => {
    // 第一个listBox对应的数据
    const [tableArr, setTableArr] = useState<tableArrType[]>(initialArr);
    // const [tableArrOrigin, setTableArrOrigin] = useState<tableArrType[]>(initialArr);
    // 第二个listBox对应的数据
    const [tableArrTwo, setTableArrTwo] = useState<tableArrType[]>(initialArrTwo);
    // const [tableArrOriginTwo, setTableArrOriginTwo] = useState<tableArrType[]>(initialArrTwo);
    // 移除数组内容方法
    const removeArrItem = useCallback((setTableArr: React.Dispatch<React.SetStateAction<tableArrType[]>>, index: number, callback?: () => void) => {
        setTableArr((preState) => {
            let temp = preState.concat([]);
            temp.splice(index,1, {...preState[index], nodeRemoveAddStatus: 1});
            return temp;
        });
        setTimeout(() => {
            setTableArr((preState) => {
                let temp = preState.concat([]);
                temp.splice(index,1);
                return temp;
            });
            callback?.();
        }, 200);
    }, []);
    // 新增数组内容方法
    const addArrItem = useCallback((setTableArr: React.Dispatch<React.SetStateAction<tableArrType[]>>, index: number, arrItem: tableArrType, callback?: () => void) => {
        setTableArr((preState) => {
            let temp = preState.concat([]);
            temp.splice(index,0, {...arrItem, nodeRemoveAddStatus: 3});
            return temp;
        });
        setTimeout(() => {
            callback?.();
        }, 200);
    }, []);
    // 监听列表拖拽事件 **一定注意闭包局部变量的使用问题（不随组件重新渲染而更新，需要自己维护）
    const addDragEvent = useCallback(() => {
        let moveIndex: number = -1; // 当前移动到的list位置
        let boxIndex: number = -1; // 当前被移动的class='listBox'盒子的索引index
        let originMoveIndex: number = -1; // 最先被移动元素list位置
        let originBoxIndex: number = -1; // 最先被移动元素所在class='listBox'盒子的索引index
        let originMoveItem: tableArrType | {} = {}; // 最先被移动元素的原始数据
        let isChange: boolean = false; // 截流用到的状态
        let moveUpTime: NodeJS.Timeout | null = null; // 提供给放开鼠标轮训判断排序动画是否完成的定时器
        let listBoxList = document.getElementsByClassName('listBox');
        for (let listBoxIndex = 0; listBoxIndex < listBoxList.length; listBoxIndex++) {
            let listBox = listBoxList[listBoxIndex] as HTMLElement;
            // eslint-disable-next-line
            listBox.onmousedown = (e: MouseEvent) => {
                // 截流
                if(isChange) {
                    return false;
                }
                let element = e.target as HTMLElement;
                let index = element.getAttribute('data-index');
                if (index) {
                    console.log(index);
                    let offsetLeft = e.clientX ? e.clientX - element.offsetLeft : 0;
                    let offsetTop = e.clientY ? e.clientY - element.offsetTop : 0;
                    let clickElementClone = element.cloneNode(true) as HTMLElement;
                    element.style.opacity = '0';
                    clickElementClone.style.position = 'absolute';
                    clickElementClone.style.width = element.offsetWidth + 'px';
                    clickElementClone.style.left = element.offsetLeft + 'px';
                    clickElementClone.style.top = element.offsetTop + 'px';
                    document.body.appendChild(clickElementClone);
                    // 记录当前正在移动的元素list索引及所在盒子索引, 记录最新移动元素的原始数据
                    moveIndex = originMoveIndex = parseInt(index);
                    boxIndex = originBoxIndex = listBoxIndex;
                    // 闭包中唯一需要使用到的state,避免依赖使用setState同步来获取最新state
                    let setFunc = listBoxIndex === 0 ? setTableArr : setTableArrTwo;
                    setFunc((pre) => {
                        originMoveItem = pre[moveIndex];
                        return pre;
                    });
                    document.onmousemove = (event: MouseEvent) => {
                        clickElementClone.style.left = event.clientX - offsetLeft + 'px';
                        clickElementClone.style.top = event.clientY - offsetTop + 'px';
                        // 节流加锁
                        if (isChange) {
                            return false;
                        }
                        for (let loopListBoxIndex = 0; loopListBoxIndex < listBoxList.length; loopListBoxIndex++) {
                            let listArr = listBoxList[loopListBoxIndex].getElementsByClassName('list');
                            for (let i = 0; i < listArr.length; i++) {
                                let listElement = listArr[i] as HTMLElement;
                                // console.log('clientX--'+event.clientX);
                                // console.log('offsetLeft'+listElement.offsetLeft);
                                // console.log('offsetLeftWidth'+listElement.offsetLeft+ listElement.offsetWidth);
                                // console.log('clientY--'+event.clientY);
                                // console.log('offsetTop--'+listElement.offsetTop);
                                // console.log('clientTopHeight--'+listElement.offsetTop + listElement.offsetHeight/2);

                                let realInsertNodeIndex: number = -1;
                                if (listElement.offsetLeft <= event.clientX
                                    && listElement.offsetLeft + listElement.offsetWidth >= event.clientX
                                    && listElement.offsetTop <= event.clientY
                                    && listElement.offsetTop + listElement.offsetHeight/2 >= event.clientY) {
                                    realInsertNodeIndex = (boxIndex === loopListBoxIndex && moveIndex !== -1) ? (i > moveIndex ? i - 1 : i) : i;
                                } else if (listElement.offsetLeft <= event.clientX
                                    && listElement.offsetLeft + listElement.offsetWidth >= event.clientX
                                    && listElement.offsetTop + listElement.offsetHeight/2 <= event.clientY
                                    && listElement.offsetTop + listElement.offsetHeight >= event.clientY) {
                                    realInsertNodeIndex = (boxIndex === loopListBoxIndex && moveIndex !== -1) ? (i + 1 > moveIndex ? i : i + 1) : i + 1;
                                }
                                // 匹配上某一个list节点则进行删除新增处理，否则继续循环判断
                                if (realInsertNodeIndex !== -1) {
                                    if (moveIndex === realInsertNodeIndex && boxIndex === loopListBoxIndex) {
                                        return false;
                                    } else {
                                        // 进行截流
                                        isChange = true;
                                        // 判断是否存在"上一个移动完成元素"需要被移除 moveIndex为-1代表没有移动元素到任何盒子的任何位置
                                        if (moveIndex !== -1) {
                                            // 这里进行判断是哪个listBox盒子(子元素可相互拖拽的分开的盒子)，如果有多个可在这进行判断新增
                                            // 然后先进行删除上一个移动位置的空元素，再新增移动元素到新的位置
                                            // eslint-disable-next-line
                                            removeArrItem(boxIndex === 0 ? setTableArr : setTableArrTwo, moveIndex, () => {
                                                addArrItem(loopListBoxIndex === 0 ? setTableArr : setTableArrTwo, realInsertNodeIndex, originMoveItem as tableArrType, () => {
                                                    // 保存当前已经移动完成的list索引及所在盒子索引
                                                    moveIndex = realInsertNodeIndex;
                                                    boxIndex = loopListBoxIndex;
                                                    isChange = false;
                                                });
                                            });
                                        } else {
                                            // eslint-disable-next-line
                                            addArrItem(loopListBoxIndex === 0 ? setTableArr : setTableArrTwo, realInsertNodeIndex, originMoveItem as tableArrType, () => {
                                                // 保存当前已经移动完成的list索引及所在盒子索引
                                                moveIndex = realInsertNodeIndex;
                                                boxIndex = loopListBoxIndex;
                                                isChange = false;
                                            });
                                        }
                                        return false;
                                    }
                                }
                            }
                        }
                        // 如果移动元素没有移动到任何list上，则清除所有的空白移动元素并设置当前移动元素moveIndex和盒子索引boxIndex
                        if (moveIndex !== -1) {
                            // 这里进行判断是哪个listBox盒子(子元素可相互拖拽的分开的盒子)，如果有多个可在这进行判断新增
                            // 然后先进行删除上一个移动位置的空元素
                            isChange = true;
                            removeArrItem(boxIndex === 0 ? setTableArr : setTableArrTwo, moveIndex, () => {
                                moveIndex = -1;
                                boxIndex = -1;
                                isChange = false;
                            });
                        } else {
                            moveIndex = -1;
                            boxIndex = -1;
                        }
                    };
                    document.onmouseup = () => {
                        document.onmousemove = null;
                        document.onmouseup = null;
                        const moveUpFunc = () => {
                            // 释放等待动画完成，启动截流器
                            isChange = true;
                            if (moveIndex !== -1) {
                                let currentChangeElement =
                                    document.getElementsByClassName('listBox')[boxIndex]
                                        .getElementsByClassName('list')[moveIndex] as HTMLElement;
                                clickElementClone.style.transition = 'left 0.2s, top 0.2s';
                                clickElementClone.style.left = currentChangeElement.offsetLeft + 'px';
                                clickElementClone.style.top = currentChangeElement.offsetTop + 'px';
                                setTimeout(() => {
                                    clickElementClone.remove();
                                    currentChangeElement.style.opacity = '';
                                    let setFunc = boxIndex === 0 ? setTableArr : setTableArrTwo;
                                    setFunc((preState) => {
                                        let temp = preState.concat([]);
                                        let json = {} as tableArrType;
                                        for(let jsonKey in temp[moveIndex]) {
                                            json[jsonKey] = temp[moveIndex][jsonKey];
                                        }
                                        delete json.nodeRemoveAddStatus;
                                        temp.splice(moveIndex, 1, json)
                                        return temp;
                                    });
                                    // 初始化状态
                                    moveIndex = -1;
                                    boxIndex = -1;
                                    originMoveIndex = -1;
                                    originBoxIndex = -1;
                                    originMoveItem = {};
                                    isChange = false;
                                }, 200);
                            } else {
                                let setFunc = originBoxIndex === 0 ? setTableArr : setTableArrTwo;
                                setFunc((preState) => {
                                    let temp = preState.concat([]);
                                    temp.splice(originMoveIndex, 0, {...originMoveItem, nodeRemoveAddStatus: 3} as tableArrType);
                                    return temp;
                                });
                                let currentChangeElement =
                                    document.getElementsByClassName('listBox')[originBoxIndex]
                                        .getElementsByClassName('list')[originMoveIndex] as HTMLElement;
                                clickElementClone.style.transition = 'left 0.2s, top 0.2s';
                                clickElementClone.style.left = currentChangeElement.offsetLeft + 'px';
                                clickElementClone.style.top = currentChangeElement.offsetTop + 'px';
                                setTimeout(() => {
                                    clickElementClone.remove();
                                    setFunc((preState) => {
                                        let temp = preState.concat([]);
                                        let json = {} as tableArrType;
                                        for(let jsonKey in temp[originMoveIndex]) {
                                            json[jsonKey] = temp[originMoveIndex][jsonKey];
                                        }
                                        delete json.nodeRemoveAddStatus;
                                        temp.splice(originMoveIndex, 1, json)
                                        return temp;
                                    });
                                    // 初始化状态
                                    moveIndex = -1;
                                    boxIndex = -1;
                                    originMoveIndex = -1;
                                    originBoxIndex = -1;
                                    originMoveItem = {};
                                    isChange = false;
                                }, 200);
                            }
                        }
                        // 排序动画正在播放，则轮训判断是否结束
                        if (isChange) {
                            moveUpTime = setInterval(() => {
                                if (!isChange) {
                                    moveUpFunc();
                                    clearInterval(moveUpTime as NodeJS.Timeout);
                                    moveUpTime = null;
                                }
                            }, 200);
                        } else {
                            moveUpFunc();
                        }
                    };
                }
            };
        }
    }, [addArrItem, removeArrItem]);
    useMount(useCallback(() => {
        addDragEvent();
    }, [addDragEvent]));
    return (
        <DragTableBox>
            <ListBox className={'listBox'}>
                {
                    tableArr.map((res, index) => (
                        <div data-index={index} className={!res.nodeRemoveAddStatus ? 'list' : res.nodeRemoveAddStatus === 1 ? 'list removeList' : res.nodeRemoveAddStatus === 2 ? 'list addList' : 'list addListEmpty'} key={res.id}>{res.name}</div>
                    ))
                }
            </ListBox>
            <ListBox className={'listBox'}>
                {
                    tableArrTwo.map((res, index) => (
                        <div data-index={index} className={!res.nodeRemoveAddStatus ? 'list' : res.nodeRemoveAddStatus === 1 ? 'list removeList' : res.nodeRemoveAddStatus === 2 ? 'list addList' : 'list addListEmpty'} key={res.id}>{res.name}</div>
                    ))
                }
            </ListBox>
        </DragTableBox>
    )
}

export default DragTable;