function kp_trigger_cl(parameters, context) {


    let registers = {};

    registers['PID.kp'] = parameters;

    return {workspace:null, registers:registers};
}