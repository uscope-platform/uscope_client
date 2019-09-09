import { createStore} from "redux";

import rootReducer from './redux/Reducers';

const initialState = {
    channelStatus:[
        {
            id:1,
            name: 'Channel 1',
            enabled: false
        },
        {
            id: 2,
            name: 'Channel 2',
            enabled: false
        },
        {
            id:3,
            name: 'Channel 3',
            enabled: false
        },
        {
            id:4,
            name: 'Channel 4',
            enabled: false
        },
        {
            id:5,
            name: 'Channel 5',
            enabled: false
        },
        {
            id:6,
            name: 'Channel 6',
            enabled: false
        }
    ],
    parameterValues:[
        {
            id: 1,
            qualified_name:'Parameter 1',
            value:0,
            description:'Parameter brief description'
        },
        {
            id: 2,
            qualified_name:'Parameter 2',
            value:0,
            description:'Parameter boring description'
        },
    ],
    registerValues:{},
    tabs: [],
    settings:{
        default_tab: "Plot"
    }
};

const store = createStore(rootReducer,initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


export default store;
