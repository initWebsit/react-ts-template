import {useEffect, useState, useCallback, useRef, useReducer, useMemo} from "react";
import { useSearchParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginAction, loginOutAction, registerAction, userSelectorCallback} from "../../redux/reducer/auth";
// import {requestTest, UserInfo} from '../../context/userInfoContext/userInfoContext';
import {RootDispatchType} from "../../redux";
import {useQuery, useQueryClient} from "react-query";
import ajax from "../../utils/request";
import {SearchTablePros} from "../../interface/searchTable/searchTable";
import {Login, LoginType} from "../../api/login/login";

// 防抖customer hook
export const useDebounce = (callback: () => void, time?: number) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            callback();
        }, time ? time : 200);
        return () => {clearTimeout(timer);};
    }, [callback, time]);
}

// 节流customer hook
// export const useThrottle = () => {
//     const timer = useRef(false);
//
//     return (callback: (func: () => void) => void) => {
//         if (timer.current) {
//             return false;
//         }
//         timer.current = true;
//         callback(() => {
//             timer.current = false;
//         });
//     }
// }
export const throttle = () => {
    let timer: boolean = false;
    return (callback: (func: () => void) => void) => {
        if (timer) {
            return false;
        }
        timer = true;
        callback(() => {
            timer = false;
        });
    }
}

// 初始化绑定customer hook
export const useMount = (callback: () => void) => {
    useEffect(() => {
        callback();
    }, [callback]);
}

// 数组处理customer hook
export const useArray = <T>(arr: T[]) => {
    const [array, setArray] = useState(arr);
    const add = useCallback((item: T):void => {
        setArray((preState) => preState.concat([item]));
    }, []);
    const clear = useCallback(():void => {
        setArray([]);
    }, []);
    const removeIndex = useCallback((index: number):void => {
        setArray((preState) => {
            let arrayTemp = preState.concat([]);
            arrayTemp.splice(index, 1);
            return arrayTemp;
        });
    }, [])
    return {
        array,
        add,
        clear,
        removeIndex
    }
}

export const ClearObj = (obj: {[key in string]: string}) => {
    let json: {[key in string]: string} = {};
    for (let objKey in obj) {
        if (obj[objKey] !== '') {
            json[objKey] = obj[objKey];
        }
    }
    return json;
}

// 获取浏览器url路径参数customer hook
export const useUrlParams = (paramsKeyArray: string[]) => {
    const [params, setParams] = useSearchParams();
    let json:{[key: string]: string | null} = {};
    paramsKeyArray.forEach((element) => {
        json[element] = params.get(element);
    });
    const setNewParams = (json: {[key in string]: string}) => {
        setParams(ClearObj({...Object.fromEntries(params), ...json}));
    }
    return {
        paramsJson: json,
        params,
        setParams,
        setNewParams
    };
}

// 判定当前组件 已被绑定或被已卸载的 customer hook
// ref.current===1为已绑定 ref.current===0为已卸载
export const useMountedRef = () => {
    const ref = useRef(1);
    useEffect(() => {
        ref.current = 1;
        return () => {
            ref.current = 0;
        }
    }, []);
    return ref;
}

// 初始化不执行的effect
export const useUpdateEffect = (effect: () => void, deps: any[]) => {
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            return effect();
        }
    }, deps);
}

// 使用useMountedRef返回安全可使用的 dispatch方法或空方法
const useSafeDispatch = <T>(dispatch: (action: actionType<T>) => void) => {
    let ref = useMountedRef();
    return ref.current === 1 ? dispatch : void 0;
}
const undoReducer = <T>(state: stateType<T>, action: actionType<T>) => {
    switch (action.type) {
        case 'SET':
            return {
                ...state,
                preQueryArray: [...state.preQueryArray, state.currentQuery],
                currentQuery: action.data,
                futureQueryArray: state.futureQueryArray,
                undoStatus: true
            };
        case 'RESET':
            return {
                ...state,
                preQueryArray: [],
                currentQuery: action.data,
                futureQueryArray: [],
                undoStatus: false,
                redoStatus: false
            };
        case 'UNDO':
            if (!state.undoStatus) {
                return state;
            }
            return {
                ...state,
                preQueryArray: state.preQueryArray.slice(0, state.preQueryArray.length - 1),
                currentQuery: state.preQueryArray[state.preQueryArray.length - 1],
                futureQueryArray: [state.currentQuery, ...state.futureQueryArray],
                undoStatus: state.preQueryArray.length > 1 ? true : false,
                redoStatus: true
            };
        case 'REDO':
            if (!state.redoStatus) {
                return state;
            }
            return {
                preQueryArray: [...state.preQueryArray, state.currentQuery],
                currentQuery: state.futureQueryArray[0],
                futureQueryArray: state.futureQueryArray.slice(1, state.futureQueryArray.length),
                undoStatus: true,
                redoStatus: state.futureQueryArray.length > 1 ? true : false
            }
        default:
            return state;
    }
}
type stateType<T> = {
    preQueryArray: T[],
    currentQuery: T,
    futureQueryArray: T[],
    undoStatus: boolean,
    redoStatus: boolean
}
type actionType<T> = {
    type: string | number | boolean,
    data?: T
}
// useUndo 设定当前值，回滚过去值，回滚未来值，重置方法的customer hook
export const useUndo = <T>(query: T) => {
    const [state, dispatch] = useReducer(undoReducer, {
        preQueryArray: [],
        currentQuery: query,
        futureQueryArray: [],
        undoStatus: false,
        redoStatus: false
    });
    const safeDispatch = useSafeDispatch(dispatch);
    const set = useCallback((setQuery: T) => {
        safeDispatch?.({
            type: 'SET',
            data: setQuery
        });
    }, [safeDispatch]);
    const reset = useCallback(() => {
        safeDispatch?.({
            type: 'RESET',
            data: query
        });
    }, [safeDispatch, query]);
    const undo = useCallback(() => {
        safeDispatch?.({
            type: 'UNDO'
        });
    }, [safeDispatch]);
    const redo = useCallback(() => {
        safeDispatch?.({
            type: 'REDO'
        });
    }, [safeDispatch]);
    return {
        undoStatus: state.undoStatus,
        redoStatus: state.redoStatus,
        state: state.currentQuery,
        set,
        reset,
        undo,
        redo
    }
}

// 用户信息redux hook
export const useAuth = () => {
    const userInfo = useSelector(userSelectorCallback);
    const dispatch = useDispatch();
    const login = (params: LoginType):Promise<any> => {
        return dispatch((dispatch: RootDispatchType) => {
            return Login(params).then((res) => {
                if (res.code === 10000) {
                    dispatch(loginAction(res.data.user_info ? res.data : null));
                }
                return res;
            });
        });
    }
    const register = (params: LoginType) => dispatch(registerAction(params));
    const loginOut = (params?: null) => dispatch(loginOutAction(params));

    return {
        userInfo,
        login,
        register,
        loginOut
    }
}

// react-query实现table async请求缓存及获取
export const useReactQueryTable = ({moduleName, personId}: SearchTablePros) => {
    // 缓存key, key变化则将重新请求
    let queryKey = ['getSearchTable', {moduleName, personId}];
    // get请求缓存
    useQuery(queryKey, () => {
        return ajax({
            method: 'get',
            url: 'https://zycs.canpoint.net/v1/teacher/info?token=eyJhbGciOiJIUzUxMiIsImlhdCI6MTYzOTc5Nzc4MiwiZXhwIjoxNjQyMzg5NzgyfQ.eyJ1c2VyX2d1aWQiOjE0MTE4MTM4Niwicm9sZV9pZCI6MTYsInV1aWQiOiJjZWVmNjk0MjVmYjExMWVjYWI3YjAwMTYzZTEyYTg2MyIsImNsaWVudCI6MTYzOTc5Nzc4Mn0.uKJNoZgDgsgfkZOarMJrPI4LTzps24t68hCNoMBAFp7sNIKceEyA3SxpARTtrjj8vihp6zy3XAre-1uywN1Znw',
            params: {
                loading: document.body
            }
        });
    });
    // post/put/delete/update等请求缓存
    // useMutation(({moduleName, personId}: SearchTablePros) => {
    //     return ajax({
    //         method: 'post',
    //         url: 'https://zycs.canpoint.net/v1/teacher/info?token=eyJhbGciOiJIUzUxMiIsImlhdCI6MTYzOTc5Nzc4MiwiZXhwIjoxNjQyMzg5NzgyfQ.eyJ1c2VyX2d1aWQiOjE0MTE4MTM4Niwicm9sZV9pZCI6MTYsInV1aWQiOiJjZWVmNjk0MjVmYjExMWVjYWI3YjAwMTYzZTEyYTg2MyIsImNsaWVudCI6MTYzOTc5Nzc4Mn0.uKJNoZgDgsgfkZOarMJrPI4LTzps24t68hCNoMBAFp7sNIKceEyA3SxpARTtrjj8vihp6zy3XAre-1uywN1Znw',
    //         data: {
    //             loading: document.body,
    //             moduleName,
    //             personId
    //         }
    //     });
    // }, {
    //     onSuccess: () => {console.log('post/put/delete/update请求成功!')}
    // });
    const query = useQueryClient();
    return {
        queryKey,
        queryArr: query.getQueryData(queryKey),
        retryRequest: query.invalidateQueries
    }
}