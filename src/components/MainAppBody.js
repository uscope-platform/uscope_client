import React, {Component} from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContent from "./TabContent";

class MainAppBody extends Component {

    create_navtabs(tab){
        return(
            <Tab eventKey={tab.name} title={tab.name}> <TabContent type={tab.type} content={tab.content}/></Tab>
        );
    };


    render() {
        return(
            <div>
                <Tabs defaultActiveKey={this.props.default_tab} id="uncontrolled-tab-example">
                    {this.props.tabs.map((tab) => {
                        return(this.create_navtabs(tab))
                    })}
                </Tabs>
            </div>
        );
    }

}

export default MainAppBody;
