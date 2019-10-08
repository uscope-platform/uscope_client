
let context_cleaner = (registers, parameters, current_parameter) =>{
    //purge register context of unwanted and potentially dangerous fields
    let register_context = {};

    // eslint-disable-next-line
    for(let periph in registers){
        let new_periph = {};
        // eslint-disable-next-line
        for(let element in registers[periph]){
            new_periph[element] = registers[periph][element];
        }
        register_context[periph] = new_periph;
    }

    //purge parameters context of unwanted and potentially dangerous fields
    let parameters_context = {};
    parameters.map((param) => {
        if(current_parameter!==param.parameter_name){
            parameters_context[param.parameter_id] = param.value;
        }
        return null;
    });
    return {registers:register_context, parameters:parameters_context};
};


let parseFunction = function (string) {
    let funcReg = /function (\S*) *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
    let match = funcReg.exec(string.replace(/(\r\n|\n|\r)/gm, ""));
    if(match) {
        // eslint-disable-next-line
        return new Function(match[2].split(','), match[3]);
    }
    return null;
};

export {context_cleaner, parseFunction};