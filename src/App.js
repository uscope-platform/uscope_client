import React, {Component} from 'react';
import MainAppBody from "./components/MainAppBody";

import { Provider } from "react-redux";

import './App.css';

import store from "./store";

class App extends Component {
  state = {
    tabs: [
      {
        id:1,
        name: 'Plot',
        type: "Scope"
      },
      {
        id:2,
        name: 'ADC Processing',
        type: 'Registers',
        content:{
          tab_id: "ADC_Processing",
          image_src: 'assets/Images/ADC_processing.png',
        }
      },
      {
        id:3,
        name: 'SPI',
        type: 'Registers',
        content:{
          tab_id:'SPI',
          image_src: 'assets/Images/SPI.png',
        }
      }
    ],
    default_tab: "Plot"
  };

  render() {
    return (
        <Provider store={store}>
          <div className="App">
            <MainAppBody tabs={this.state.tabs} />
          </div>
        </Provider>
    );
  }
}

export default App;
