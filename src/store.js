import { createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';





import rootReducer from './redux/Reducers';

const initialState = {
    channelStatus:[],
    parameterValues:[],
    registerValues:{},
    tabs: [],
    settings:{
        default_tab: "Plot",
        refreshRate: 150
    }
};


let middleware =[thunk];
const store = createStore(rootReducer,initialState, composeWithDevTools(applyMiddleware(...middleware)));


export default store;
