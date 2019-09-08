import React, {Component} from 'react';
import MainAppBody from "./components/MainAppBody";

import { Provider } from "react-redux";

import './App.css';

import store from "./store";

class App extends Component {

  render() {
    return (
        <Provider store={store}>
          <div className="App">
            <MainAppBody />
          </div>
        </Provider>
    );
  }
}

export default App;
