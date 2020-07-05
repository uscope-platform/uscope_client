import styled from 'styled-components';

const Label = styled.label`
width: fit-content;
font-family: Roboto,Helvetica,Arial,sans-serif;
font-size: 1rem;
margin-bottom: ${props => props.inline ? "1rem" : "0rem"};
padding-right: 0.5rem;
`
export default Label;
