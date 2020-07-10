import styled from "styled-components";
import React from "react";
import Label from "./Label";

const InputTextArea = styled.textarea`
  border-radius: 5px;
`

const Wrapper = styled.div`
 display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`

class TextArea extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
    render() {
        return (
            <Wrapper>
                <Label>{this.props.label}</Label>
                <InputTextArea
                    rows={this.props.rows}
                    name={this.props.name}
                    value={this.props.value}
                    disabled = {(this.props.disabled)? "disabled" : ""}
                    onChange={e => this.props.onChange(e)}/>
            </Wrapper>
        );

    }
}

export default TextArea;
