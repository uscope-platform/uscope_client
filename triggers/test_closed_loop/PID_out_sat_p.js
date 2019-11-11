function pid_out_sat_max_cl(parameters, context) {


    let registers = {};

    registers['PID.out_sat_p'] = parameters;

    return {workspace:null, registers:registers};
}