import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/font/iconfont.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import { UserInfoProvider } from "./context/userInfoContext/userInfoContext";
import {Provider} from "react-redux";
import {store} from "./redux";
// import {QueryClient, QueryClientProvider} from "react-query";
// const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
      {/*react-query请求缓存运用*/}
      {/*<QueryClientProvider client={queryClient}>*/}
          {/*react-redux状态管理运用*/}
          <Provider store={store}>
              {/*useContext状态管理运用*/}
              <UserInfoProvider>
                  <App />
              </UserInfoProvider>
          </Provider>
      {/*</QueryClientProvider>*/}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
