import {ENABLE_CHANNEL, DISABLE_CHANNEL} from "../Actions/types";



let channelStatusReducer = function (state = null, action) {
    switch (action.type) {
        case ENABLE_CHANNEL:
            return state.map(channel => {
                if (channel.name === action.payload.name) {
                    return {...channel, enabled:  action.payload.enabled}
                }
                return channel;
            });
        case DISABLE_CHANNEL:
            return state.map(channel => {
                if (channel.name === action.payload.name) {
                    return {...channel, enabled:  action.payload.enabled}
                }
                return channel;
            });
        default:
            return state;
    }
};

export default channelStatusReducer;
