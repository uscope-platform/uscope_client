import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContent from "./TabContent";

let MainAppBody = props => {
    return(
        <div>
            <Tabs defaultActiveKey={props.default_tab} id="uncontrolled-tab-example">
                {props.tabs.map((tab) => {
                    return(
                            <Tab eventKey={tab.name} title={tab.name}> <TabContent type={tab.type} content={tab.content}/></Tab>
                    )
                })}
            </Tabs>
        </div>
    );
};

export default MainAppBody;
