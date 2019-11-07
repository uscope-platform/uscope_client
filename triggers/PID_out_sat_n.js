function pid_out_sat_min_cl(parameters, context) {


    let registers = {};

    registers['PID.out_sat_n'] = parameters;

    return {workspace:null, registers:registers};
}