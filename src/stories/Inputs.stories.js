import React from 'react';
import InputField from "../components/UI_elements/InputField";
import Checkbox from "../components/UI_elements/checkbox";
import Select from "../components/UI_elements/Select";
import {action} from '@storybook/addon-actions';
import Radio from "../components/UI_elements/Radio";
import TextArea from "../components/UI_elements/TextArea";
import RegisterProperties from "../components/UI_elements/SidebarComponents/RegisterProperties";


export default {
    title: 'Inputs',
    component: InputField,
};

let regular_change_handler = () =>{
    console.log("test")
    action('regular form changed');
};

let inline_change_handler = () =>{
    action('inline form changed');
};

export const TextField = () => <InputField onChange={regular_change_handler} label="Regular Text Field"/>

export const InlineTextField = () => <InputField inline onChange={inline_change_handler} label="Inline Text field"/>

export const CompactTextField = () => <InputField compact onChange={inline_change_handler} label="Compact Text Field"/>

export const CheckboxField = () => <Checkbox onChange={inline_change_handler} label="Checkbox Field"/>

export const SelectField = () => <Select>
                                    <option value="" hidden>
                                        Type
                                    </option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </Select>

export const RadioField = () => <Radio onChange={inline_change_handler} label="Checkbox Field"/>

export const TextAreaField = () => <TextArea onChange={inline_change_handler} rows={5} label="Text Area"/>


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
