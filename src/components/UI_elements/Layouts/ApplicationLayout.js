import styled,{css} from "styled-components";

const ApplicationLayout = styled.div`
    display: grid;
    grid-template-columns: 200px auto 300px;
    grid-auto-rows: auto;
    height: 100vh;
    ${props => !props.sidebarNeeded && css`
        grid-template-columns: 200px  auto;
    `}
 
`

export default ApplicationLayout
