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
    registerValues:{
        SPI:[
            {
                qualified_name:'Register 1',
                type:'single',
                value:123,
                description:'Register brief description'
            },
            {
                qualified_name:'Register 2',
                type:'single',
                value:456,
                description:'Register long description'
            },
            {
                qualified_name:'Register 3',
                type:'single',
                value:789,
                description:'Register boring description'
            },
            {
                qualified_name: 'Register 4',
                display_name:['Field 4.1', 'Field 4.2'],
                type:'two',
                value:[7891,7892],
                description:['Register boring description','Register ultra boring description']
            }
        ],
        ADC_Processing:[
            {
                qualified_name:'Register 1',
                type:'single',
                value:123,
                description:'Register brief description'
            },
            {
                qualified_name:'Register 2',
                type:'single',
                value:456,
                description:'Register long description'
            },
            {
                qualified_name:'Register 3',
                type:'single',
                value:789,
                description:'Register boring description'
            },
            {
                qualified_name: 'Register 4',
                display_name:['Field 4.1', 'Field 4.2'],
                type:'two',
                value:[7891,7892],
                description:['Register boring description','Register ultra boring description']
            }
        ]
    }
};

const store = createStore(rootReducer,initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


export default store;
