function ref_trigger_cl(parameters, context) {


    let registers = {};


    let ref = parameters << 1;

    registers['GPIO.out'] = ref+1;



    return {workspace:null, registers:registers};
}