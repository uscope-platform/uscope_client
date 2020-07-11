

let create_register = (name, type) =>{

     return {
         "ID": name.replace(" ", "_").toLowerCase(),
         "register_name": name,
        "description": "",
        "direction": "",
        "field_descriptions": [],
        "field_names": [],
        "offset": "0x0",
        "register_format": type
    }
}

export default create_register;