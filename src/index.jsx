// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import {createRoot} from "react-dom/client";
import App from './App';
import {Provider} from "react-redux";
import store from "./store";
import {PersistGate} from "redux-persist/lib/integration/react";
import {BrowserRouter} from "react-router-dom";
import {setup} from "goober";

import './fonts/montserrat-v14-latin-ext_latin-100.woff2'
import './fonts/montserrat-v14-latin-ext_latin-200.woff2'
import './fonts/montserrat-v14-latin-ext_latin-300.woff2'
import './fonts/montserrat-v14-latin-ext_latin-regular.woff2'
import './fonts/montserrat-v14-latin-ext_latin-500.woff2'
import {persistStore} from "redux-persist";



const container = document.getElementById("root");
const root = createRoot(container);
const persistor = persistStore(store);

setup(React.createElement);

if (import.meta.hot) {
    import.meta.hot.accept();
}

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
);