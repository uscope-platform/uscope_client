function ki_trigger_cl(parameters, context) {


    let registers = {};

    registers['PID.ki'] = parameters;

    return {workspace:null, registers:registers};
}