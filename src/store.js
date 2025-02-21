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

import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import rootReducer from './redux/Reducers';
import {configureStore} from '@reduxjs/toolkit';

// TODO: immer AutoFreeze breaks plotly because plotly modifies his inputs!!! that are passes through redux
import { setAutoFreeze } from 'immer';
setAutoFreeze(false);

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: hardSet,
    whitelist: ['scripts', 'peripherals', 'applications', 'programs', 'bitstreams', 'filters']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});


export default store;
