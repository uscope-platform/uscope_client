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

const theme = {
    base: "#08081A",
    level_1:"#162447",
    level_2:"#1f4068",
    accents:"#e43f5a"
};

export default ApplicationLayout
