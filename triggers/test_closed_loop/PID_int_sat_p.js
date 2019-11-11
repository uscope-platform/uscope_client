function pid_int_sat_max_cl(parameters, context) {


    let registers = {};

    registers['PID.int_sat_p'] = parameters;

    return {workspace:null, registers:registers};
}