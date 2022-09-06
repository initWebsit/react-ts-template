import React from 'react';
import {Navigate, RouteObject, useLocation} from 'react-router-dom';
import RouterLoading from "../components/routerLoading/routerLoading";
import {routeType} from "../router/routerConfig";
import {useAuth} from "../hook/common/common";

// 将自定义路由配置转换成,react-router实际需求路由，的方法
export const transformRouter = (routes: routeType[]): RouteObject[] => {
    let routeArray: RouteObject[] = [];
    routes.forEach((res) => {
        let routeItem: RouteObject = {};
        if (res.path) {
            routeItem.path = res.path;
        }
        if (res.index) {
            routeItem.index = res.index;
        }
        if (res.redirect) {
            routeItem.element = <Navigate to={res.redirect} replace={true}/>
        }
        if(res.element) {
            routeItem.element = <res.element/>;
        }
        if (res.component) {
            const Component = React.lazy(res.component);
            routeItem.element = <React.Suspense fallback={<RouterLoading/>}><Component/></React.Suspense>
        }
        if (routeItem.element) {
            routeItem.element = <RouteMiddleWare element={routeItem.element} meta={res.meta ? res.meta : {}}/>;
        }
        if (res.children && res.children.length > 0) {
            let children: RouteObject[] = transformRouter(res.children);
            routeItem.children = children;
        }
        routeArray.push(routeItem);
    });
    return routeArray;
}

// 路由页面组件中间件高阶函数，用于包裹路由组件进行路由守卫操作（在路由path变化后，页面重新渲染后触发该方法）
const RouteMiddleWare = ({element, meta}: {element: React.ReactNode, meta: {[key in any]: any}}) => {
    const {pathname} = useLocation();
    const {userInfo} = useAuth();
    let returnElement: React.ReactNode = element;
    // 路由守卫验证逻辑
    if (!userInfo && !meta.skipCheck && pathname !== '/login') {
        returnElement = <Navigate to={'/login'} replace={true}/>
    }
    return (
        <>
            {returnElement}
        </>
    );
}