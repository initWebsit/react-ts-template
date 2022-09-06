import TestContainer from 'views/testContainer/testContainer';
import Main from '../views/main/main';
import MyWorkMain from '../views/main/myWorkMain/myWorkMain';
import Task from '../views/main/myWorkMain/task/task';
import MyWorkLoadMain from '../views/main/myWorkLoadMain/myWorkLoadMain';

const Login = () => import('views/login/login');
const Title = () => import('../views/testChildren/title');
const Icon = () => import('../views/testChildren/icon');
const DragTable = () => import('../views/dragTable/dragTable');

const TaskList = () => import('../views/main/myWorkMain/task/taskList/taskList');
const TaskCompleted = () => import('../views/main/myWorkMain/task/taskCompleted/taskCompleted');
const FulfilledWorkList = () => import("../views/main/myWorkMain/fulfilledWorkList/fulfilledWorkList");
const CorrectResult = () => import("../views/main/myWorkMain/correctResult/correctResult");

const MyWorkLoad = () => import('../views/main/myWorkLoadMain/myWorkLoad/myWorkLoad');
const MyWorkLoadDetail = () => import('../views/main/myWorkLoadMain/myWorkLoadDetail/myWorkLoadDetail');

const UpdateWorkMain = () => import('../views/main/updateWorkMain/updateWorkMain');

export interface routeType {
    path?: string,
    element?: (() => JSX.Element), // 同步引入组件
    component?: (() => Promise<{readonly default: () => JSX.Element}>), // 异步引入组件
    index?: boolean,
    redirect?: string
    meta?: {
        [key in any]: any
    },
    children?: routeType[]
}

const routes: routeType[] = [
    {
        path: '/container',
        element: TestContainer,
        children: [
            {
                path: 'title',
                component: Title
            },
            {
                path: 'icon',
                component: Icon
            },
            {
                index: true,
                redirect: 'title'
            },
            {
                path: '*',
                redirect: 'title'
            }
        ]
    },
    {
        path: '/dragTable',
        component: DragTable
    },
    {
        path: '/main',
        element: Main,
        children: [
            {
                path: 'myWorkMain',
                element: MyWorkMain,
                children: [
                    {
                        path: 'task',
                        element: Task,
                        children: [
                            {
                                path: 'taskList',
                                component: TaskList
                            },
                            {
                                path: 'taskCompleted',
                                component: TaskCompleted
                            },
                            {
                                path: '*',
                                redirect: 'taskList'
                            },
                            {
                                index: true,
                                redirect: 'taskList'
                            }
                        ]
                    },
                    {
                        path: 'fulfilledWorkList',
                        component: FulfilledWorkList
                    },
                    {
                        path: 'correctResult',
                        component: CorrectResult
                    },
                    {
                        path: '*',
                        redirect: 'task'
                    },
                    {
                        index: true,
                        redirect: 'task'
                    }
                ]
            },
            {
                path: 'myWorkLoadMain',
                element: MyWorkLoadMain,
                children: [
                    {
                        path: 'myWorkLoad',
                        component: MyWorkLoad
                    },
                    {
                        path: 'myWorkLoadDetail',
                        component: MyWorkLoadDetail
                    },
                    {
                        path: '*',
                        redirect: 'myWorkLoad'
                    },
                    {
                        index: true,
                        redirect: 'myWorkLoad'
                    }
                ]
            },
            {
                path: 'updateWorkMain',
                component: UpdateWorkMain
            },
            {
                index: true,
                redirect: 'myWorkMain'
            },
            {
                path: '*',
                redirect: 'myWorkMain'
            }
        ]
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '*',
        redirect: '/login'
    }
];

export const loginRoutes = [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '*',
        redirect: '/login'
    }
];

export default routes;