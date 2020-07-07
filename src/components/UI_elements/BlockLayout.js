import styled, {css} from "styled-components";

const BlockLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content;
    grid-row-gap: 1em;
    
    background-color: #162447;
    border-radius: 1rem;
    padding: 1rem;
    height: fit-content;
    width: fit-content;
    ${props => props.centered && css`
        margin-left: auto;
        margin-right: auto;
    `}
    
`

export default BlockLayout;
