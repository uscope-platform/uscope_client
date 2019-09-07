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
        type: "Scope",
        content:{
          channels:[
            {
              id:1,
              name: 'Channel 1'
            },
            {
              id: 2,
              name: 'Channel 2'
            },
            {
              id:3,
              name: 'Channel 3'
            },
            {
              id:4,
              name: 'Channel 4'
            },
            {
              id:5,
              name: 'Channel 5'
            },
            {
              id:6,
              name: 'Channel 6'
            }

          ],
          parameters:[
            {
              id: 1,
              name:'Parameter 1',
              default_value:123,
              description:'Parameter brief description'
            },
            {
              id: 2,
              name:'Parameter 2',
              default_value:1230,
              description:'Parameter boring description'
            },
          ]
        }
      },
      {
        id:2,
        name: 'ADC Processing',
        type: 'Registers',
        content:{
          image_src: 'assets/Images/ADC_processing.png',
          registers:[
            {
              name:'Register 1',
              type:'single',
              default_value:123,
              description:'Register brief description'
            },
            {
              name:'Register 2',
              type:'single',
              default_value:456,
              description:'Register long description'
            },
            {
              name:'Register 3',
              type:'single',
              default_value:789,
              description:'Register boring description'
            },
            {
              name:['Register 4.1', 'Register 4.2'],
              type:'two',
              default_value:[7891,7892],
              description:['Register boring description','Register ultra boring description']
            }
          ]
        }
      },
      {
        id:3,
        name: 'SPI',
        type: 'Registers',
        content:{
          image_src: 'assets/Images/SPI.png',
          registers:[
            {
              name:'Register 1',
              type:'single',
              default_value:123,
              description:'Register brief description'
            },
            {
              name:'Register 2',
              type:'single',
              default_value:456,
              description:'Register long description'
            },
            {
              name:'Register 3',
              type:'single',
              default_value:789,
              description:'Register boring description'
            },
            {
              name:['Register 4.1', 'Register 4.2'],
              type:'two',
              default_value:[7891,7892],
              description:['Register boring description','Register ultra boring description']
            }
          ]
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
