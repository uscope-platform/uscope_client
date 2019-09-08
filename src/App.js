import React from 'react';

import {Tab, Tabs} from "react-bootstrap";
import TabContent from "./components/TabContent";
import {useSelector} from "react-redux";


import './App.css';

let App =  props => {
  const tabs = useSelector(
      state => state.tabs
  );
  const settings = useSelector(
      state => state.settings
  );
    return (
      <div className="App">
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

export default App;


