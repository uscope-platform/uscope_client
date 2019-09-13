import {SHOW_MODAL, HIDE_MODAL} from "./types";


export const showModal = (modal) => ({
    type: SHOW_MODAL,
    payload:{
        name: modal,
        value: true,
    }
});

export const hideModal = (modal) => ({
    type: HIDE_MODAL,
    payload:{
        name: modal,
        value: false,
    }
});
