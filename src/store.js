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
        refreshRate: 150,
        plot: {
            layout: {
                width: "1200",
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
            memory_depth: 1024
        }
    }
};


let middleware =[thunk];
const store = createStore(rootReducer,initialState, composeWithDevTools(applyMiddleware(...middleware)));


export default store;
