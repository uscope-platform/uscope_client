import {HIDE_MODAL, SHOW_MODAL} from "./types";


export const showModal = (modal, idx=-1) => ({
    type: SHOW_MODAL,
    payload:{
        name: modal,
        idx: idx,
        value: true,
    }
});

export const hideModal = (modal, idx=-1) => ({
    type: HIDE_MODAL,
    payload:{
        name: modal,
        idx: idx,
        value: false,
    }
});
