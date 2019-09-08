import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContent from "./TabContent";

import {useSelector} from "react-redux";

let MainAppBody = props => {
    const tabs = useSelector(
        state => state.tabs
    );
    const settings = useSelector(
        state => state.settings
    );

    return(
        <div>
            <Tabs defaultActiveKey={settings.default_tab} id="uncontrolled-tab-example">
                {tabs.map((tab) => {
                    return(
                            <Tab eventKey={tab.name} title={tab.name}> <TabContent tab={tab}/></Tab>
                    )
                })}
            </Tabs>
        </div>
    );
};

export default MainAppBody;
