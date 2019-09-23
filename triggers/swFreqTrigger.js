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
}