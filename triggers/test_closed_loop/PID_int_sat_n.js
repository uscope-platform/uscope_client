function pid_int_sat_min_cl(parameters, context) {


    let registers = {};

    registers['PID.int_sat_n'] = parameters;

    return {workspace:null, registers:registers};
}