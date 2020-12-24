import ReactSelect from 'react-select';
import React from 'react';
import {ColorTheme} from "./ColorTheme";
import styled from "styled-components";
import {Label} from "./Label";

const Style = {
        menu: (provided, state) => ({
                ...provided,
                zIndex:9999,
                backgroundColor: ColorTheme.dark_theme.level_1,
        }),
        menuPortal: (provided, state) => ({
                ...provided,
                zIndex:9999,
        }),
};

const Wrapper = styled.div`
margin: 0 0.2rem;
display: grid;
grid-template-columns: 1fr;
grid-auto-rows: auto;
justify-content:start;
align-items: center;
flex-flow: wrap;
`

export let  MultiSelect = props =>{
        return (
            <Wrapper inline={props.inline}>
                    <Label inline={props.inline}>{props.label}</Label>
                    <ReactSelect
                        isMulti={true}
                        styles={Style}
                        options={props.options}
                        menuPortalTarget={document.body}
                        value={props.value}
                        onChange={e => {if(props.onChange) props.onChange(e)}}
                    />
            </Wrapper>

        );
};
