import styled, {css} from "styled-components";

export const ApplicationLayout = styled.div`
    display: grid;
    grid-template-columns: 2fr 8fr 2fr;
    grid-gap: 1.5rem;
    margin: 1rem 0 0 0;
    grid-auto-rows: auto;
    height: 96.5vh;
    ${props => !props.sidebarNeeded && css`
        grid-template-columns: 2fr 10fr;
    `}
 
`