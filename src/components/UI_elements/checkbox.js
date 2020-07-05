import styled from 'styled-components';
import React from "react";
import Label from "./Label";

const InputCheckbox = styled.input`
`

const Wrapper = styled.div`
display: flex;
align-items: center;
flex-flow: wrap;
`

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
    render() {
        return (
            <Wrapper>
                <Label inline={this.props.inline}>{this.props.label}</Label>
                <InputCheckbox
                    name={this.props.name}
                    type="checkbox"
                    onChange={e => this.props.onChange(e)}
                />
            </Wrapper>
        );

    }
}

export default Checkbox;
