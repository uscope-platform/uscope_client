function coeff_den_trigger_cl(parameters, context) {

    let registers = {};
    let workspace = {};

    registers['PID.coeff_den'] = parameters;

    return {workspace:workspace, registers:registers};
}