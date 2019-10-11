import { createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'
//import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import rootReducer from './redux/Reducers';






const initialState = {

};


const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: hardSet,
    whitelist: ['scripts', 'peripherals', 'applications']
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
