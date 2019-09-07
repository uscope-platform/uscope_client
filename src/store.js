import { createStore} from "redux";

import rootReducer from './reduxReducers';

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
    ]
};

const store = createStore(rootReducer,initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


export default store;
