
export let create_channel = (name) =>{
    return {
        name: name,
        id: name.replace(/\s/g, "_").toLowerCase(),
        enabled: false,
        max_value: "1000",
        min_value: "0"
    }
}

export let create_irv = (address) =>{
    return {
        address:address,
        value:"0"
    }
}

export let create_macro = (name) =>{
    return {
        name: name,
        trigger: ""
    }
}

export let create_parameter = (name) =>{
    return {
        parameter_name: name,
        parameter_id: name.replace(/\s/g, "_").toLowerCase(),
        trigger: '',
        value: '0',
        visible: false
    }
}

export let create_peripheral = (name) =>{
    return {
        name: name,
        tab_id: name.replace(/\s/g, "_").toLowerCase(),
        base_address: '0',
        proxied: false,
        proxy_address:'0',
        type: 'Registers',
        user_accessible: false
    }
}

