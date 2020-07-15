export let create_peripheral = (name) => {
    //The peripheral image path is set directly by the server, as doing anything else would create unnecessary coupling
    return{
        [name]: {
            peripheral_name: name,
            version: 0.1,
            registers: []
        }
    };
}

export let create_register = (name, type) =>{
    return {
        ID: name.replace(/\s/g, "_").toLowerCase(),
        register_name: name,
        description: "",
        direction: "",
        field_descriptions: [],
        field_names: [],
        offset: "0x0",
        register_format: type
    }
}




