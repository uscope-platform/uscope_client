import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from "react-redux";
import store, {persistor} from "./store";
import {PersistGate} from "redux-persist/lib/integration/react";
import {BrowserRouter} from "react-router-dom";

import './fonts/montserrat-v14-latin-ext_latin-100.woff2'
import './fonts/montserrat-v14-latin-ext_latin-200.woff2'
import './fonts/montserrat-v14-latin-ext_latin-300.woff2'
import './fonts/montserrat-v14-latin-ext_latin-regular.woff2'
import './fonts/montserrat-v14-latin-ext_latin-500.woff2'

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);
