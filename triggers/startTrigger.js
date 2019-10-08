function start_trigger(parameters, context) {
    console.log(context);

    let registers = {};
    registers['ADC_processing.filter tap 5'] = 1245;
    return {workspace:null, registers:registers};
}