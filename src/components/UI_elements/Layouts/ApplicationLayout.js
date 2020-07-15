import styled, {css} from "styled-components";

const ApplicationLayout = styled.div`
    display: grid;
    grid-template-columns: 200px auto 300px;
    grid-gap: 1.5rem;
    margin: 1rem 0 0 0;
    grid-auto-rows: auto;
    height: 98vh;
    ${props => !props.sidebarNeeded && css`
        grid-template-columns: 200px  auto;
    `}
 
`

export default ApplicationLayout
