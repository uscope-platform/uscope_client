function switching_frequency_trigger(parameters, context) {


    let period = 1/parameters;
    let center = period/2;
    let on_period = period*context.parameters.duty;

    let output_turn_on = center-on_period/2;
    let output_turn_off = center+on_period/2;

    let low_side_turn_off = output_turn_on-context.parameters.deadtime/2;
    let high_side_turn_on = output_turn_on+context.parameters.deadtime/2;
    let high_side_turn_off = output_turn_off-context.parameters.deadtime/2;
    let low_side_turn_on = output_turn_off+context.parameters.deadtime/2;


    let return_struct = {};
    return_struct['low_side_turn_off_mid'] = low_side_turn_off-context.parameters.mid_lvl_duration/2;
    return_struct['low_side_turn_off_neg'] = low_side_turn_off+context.parameters.mid_lvl_duration/2;
    return_struct['low_side_turn_on_mid'] = low_side_turn_on-context.parameters.mid_lvl_duration/2;
    return_struct['low_side_turn_on_full'] = low_side_turn_on+context.parameters.mid_lvl_duration/2;

    return_struct['high_side_turn_on_mid'] = high_side_turn_on-context.parameters.mid_lvl_duration/2;
    return_struct['high_side_turn_on_full'] = high_side_turn_on+context.parameters.mid_lvl_duration/2;
    return_struct['high_side_turn_off_mid'] = high_side_turn_off-context.parameters.mid_lvl_duration/2;
    return_struct['high_side_turn_off_neg'] = high_side_turn_off+context.parameters.mid_lvl_duration/2;

    return return_struct;
}