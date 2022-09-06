import React from 'react';
import Router from 'router/router';
import {BrowserRouter} from 'react-router-dom';
import AxiosRequest from "./components/axiosRequest/axiosRequest";

function App() {
    return (
        <BrowserRouter>
            <AxiosRequest/>
            <Router/>
        </BrowserRouter>
    );
}

export default App;
