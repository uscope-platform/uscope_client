import {PLOT_PLAY, PLOT_PAUSE, PLOT_STOP} from "./types";

export const plotPlay = () =>{
    return{
        type: PLOT_PLAY,
        payload:{
            name: 'running',
            value: true
        }
    }
};

export const plotPause = () =>{
    return{
        type: PLOT_PAUSE,
        payload:{
            name: 'running',
            value: false
        }
    }
};

export const plotStop = () =>{
    return{
        type: PLOT_STOP,
        payload:{
            name: 'running',
            value: false
        }
    }
};
