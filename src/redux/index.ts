import {configureStore} from '@reduxjs/toolkit';
import {auth} from './reducer/auth';

export const store = configureStore({
    reducer: {
        auth: auth.reducer
    }
});

export type RootDispatchType = typeof store.dispatch;
// @ts-ignore
export type RootStateType = ReturnType<typeof store.getState>