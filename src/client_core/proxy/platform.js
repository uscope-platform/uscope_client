import {backend_delete, backend_get, backend_post} from "./backend";


export const add_user = user =>{
    return backend_post('auth/user', user);
}

export const remove_user = user =>{
    return backend_delete('auth/user', user);
}

export const need_onboarding = () =>{
    return backend_get("auth/onboarding");
}

export const  do_onboarding = user =>{
    return backend_post('auth/onboarding', user);
}

export const get_users_list = () =>{
    return backend_get("auth/user");
}

export const dump_database = () =>{
    return backend_get('database/export');
}

export const restore_database = db_file =>{
    return backend_post('database/import', db_file);
}
