import { createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";

import rootReducer from './redux/Reducers';



let base_data = [];

// eslint-disable-next-line
for(let i = 0; i<7;i++){
    base_data.push({
        x: Array.from(Array(1024).keys()),
        y:  Array(1024).fill(0),
        type: 'scatter',
        mode: 'lines',
        name: 'channel_'+ i,
        visible: false
    });
}



const initialState = {
    plot:{
        data:base_data,
        loading_done:false,
        plot_running:false,
        datarevision:0,
        parameters:{
            memory_depth: 1024
        },
        layout: {
            width: "1024",
            height: "auto",
            title: 'A Fancy Plot',
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor:"#444",
            font: {
                color: '#FFFFFF'
            },
            xaxis: {
                showline: true,
                showgrid: true,
                tickcolor: '#FFFFFF',
                linecolor: '#FFFFFF',
                gridcolor: '#777777'
            },
            yaxis: {
                showline: true,
                showgrid: true,
                tickcolor: '#FFFFFF',
                linecolor: '#FFFFFF',
                gridcolor: '#777777'
            }
        },
        configs: {
            responsive: true,
            displaylogo: false
        },
    },
    parameterValues:[],
    registerValues:{},
    tabs: [],
    modals: {
        application_choice:false,
        timebase_choice:false,
        scope_mode_choice:false,
        channel_settings_choice: [false, false, false,false, false, false],
        tab_creator_image_choice: false,
        tab_creator_register_modal: false,
        tab_creator_app_param_modal:false
    },
    settings:{
        default_tab: "Plot",
        refreshRate: 90
    },
    scripts:[]
};


const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel1,
    whitelist: ['scripts']
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
