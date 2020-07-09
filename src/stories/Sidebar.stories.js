import React from 'react';
import RegisterProperties from "../components/UI_elements/RegisterProperties";
import Button from "../components/UI_elements/Button";

export default {
    title: 'Sidebar',
};

const reg_example = {
    "ID": "cmp_thr_1",
    "description": "This register controls the thresholds for the low (latching mode) and low-falling (normal mode) thresholds, for the filtered (lower word) and fast acting (higher word) comparators",
    "direction": "R/W",
    "field_descriptions": [
        "Threshold for the filtered comparator",
        "Threshold for the fast acting comparator"
    ],
    "field_names": [
        "Filtered threshold",
        "Fast threshold"
    ],
    "offset": "0x0",
    "register_format": "words",
    "register_name": "Comparators threshold 1",
    "value": 0
}
export const RegisterPropertiesExample = () => <RegisterProperties register={reg_example}/>
