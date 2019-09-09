import { createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';





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
    parameterValues:[],
    registerValues:{},
    tabs: [],
    settings:{
        default_tab: "Plot"
    }
};


let middleware =[thunk];
const store = createStore(rootReducer,initialState, composeWithDevTools(applyMiddleware(...middleware)));


export default store;
