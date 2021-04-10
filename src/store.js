import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import rootReducer from './redux/Reducers';

// TODO: immer AutoFreeze breaks plotly because plotly modifies his inputs!!! that are passes through redux
import { setAutoFreeze } from 'immer';
setAutoFreeze(false);

const initialState = {

};


const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: hardSet,
    whitelist: ['scripts', 'peripherals', 'applications', 'programs']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);




const actionSanitizer = (action) => (
    action.type === 'FETCH_DATA' && action.data ?
        { ...action, data: '<<DATA_BLOB>>' } : action
);

const composeEnhancers = composeWithDevTools({
    actionSanitizer,
    stateSanitizer: (state) => state.data ? { ...state, data: '<<DATA_BLOB>>' } : state
});

let middleware =[thunk];

const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(
        applyMiddleware(...middleware)
    )
);



export default store;
export const persistor = persistStore(store);
