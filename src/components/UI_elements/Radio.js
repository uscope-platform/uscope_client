import styled from 'styled-components';
import React from "react";

import Label from "./Label";

const InputRadio = styled.input`
height: 1rem;
`

const Wrapper = styled.div`
 display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`

class Radio extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
    render() {
        return (
            <Wrapper>
                <InputRadio
                    name={this.props.name}
                    id={this.props.id}
                    type="radio"
                    onChange={e => this.props.onChange(e)}/>
                <Label inline={this.props.inline}>{this.props.label}</Label>
            </Wrapper>
        );

    }
}

export default Radio;
