import React from 'react';
import Button  from "../components/UI_elements/Button";
import {action} from "@storybook/addon-actions";

export default {
  title: 'Button',
  component: Button,
};

export const Full = () =>
    <>
        <Button onClick={action("Clicked default button")}> default button</Button>
        <Button onClick={action("Clicked confirm button")} confirm>success button</Button>
        <Button onClick={action("Clicked deny button")} deny>failure button</Button>
    </>

export const outline = () =>
    <>
        <Button outline onClick={action("Clicked default button")}> default button</Button>
        <Button outline onClick={action("Clicked confirm button")} confirm>success button</Button>
        <Button outline onClick={action("Clicked deny button")} deny>failure button</Button>
    </>
