// import {useUserInfo} from '../context/userInfoContext/userInfoContext';
// import {useAuth} from "../hook/common/common";
import routerConfig from "./routerConfig";
import {transformRouter} from "../utils/routerCommon";
import {useRoutes} from "react-router-dom";

const Router = () => {
    // 通过use-context获取用户信息进行路由守卫
    // const {userInfo} = useUserInfo();
    // 通过react-redux获取用户信息进行路由守卫
    // const {userInfo} = useAuth();
    const element = useRoutes(transformRouter(routerConfig));
    return (
        element
        // <BrowserRouter>
        //     {
        //         userInfo
        //             ?
        //             <Routes>
        //                 <Route path={'/login'} element={<Login/>}/>
        //                 <Route path={'/container'} element={<TestContainer/>}>
        //                     <Route path={'title'} element={<React.Suspense fallback={<RouterLoading/>}><Title/></React.Suspense>}/>
        //                     <Route path={'icon'} element={<React.Suspense fallback={<RouterLoading/>}><Icon/></React.Suspense>}/>
        //                     <Route index element={<Navigate to={'title'} replace={true}/>}/>
        //                     <Route path={'*'} element={<Navigate to={'title'} replace={true}/>}/>
        //                 </Route>
        //                 <Route path={'/dragTable'} element={<React.Suspense fallback={<RouterLoading/>}><DragTable/></React.Suspense>}></Route>
        //                 <Route path={'/*'} element={<Navigate to={'/login'}/>}/>
        //             </Routes>
        //             :
        //             <Routes>
        //                 <Route path={'/login'} element={<Login/>}/>
        //                 <Route path={'/*'} element={<Navigate to={'/login'} replace={true}/>}/>
        //             </Routes>
        //     }
        // </BrowserRouter>
    )
}
export default Router;