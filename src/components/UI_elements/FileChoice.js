import styled from 'styled-components';
import React from "react";

import Label from "./Label";

const InputChoice = styled.input`
`

const Wrapper = styled.div`
 display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`

class FileChoice extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
    render() {
        return (
            <Wrapper>
                <Label inline={this.props.inline}>{this.props.label}</Label>
                <InputChoice
                    name={this.props.name}
                    type="file"
                    onChange={e => this.props.onChange(e)}
                />
            </Wrapper>
        );

    }
}

export default FileChoice;
