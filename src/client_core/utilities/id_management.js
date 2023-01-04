

export let get_next_id =(ids) => {
    let id = null;
    if(ids.length === 0) return 1;
    for(var i = 1; i < ids.length; i++) {
        if(ids[i] - ids[i-1] !== 1) {
            id = ids[i-1]+1;
        }
    }
    if(id===null)
        id = ids.length+1;
    return id;
}