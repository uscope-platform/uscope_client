

//       REACT AND BOOTSTRAP IMPORTS
import React, {Component} from 'react';

//       REDUX IMPORTS
import {connect} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {loadTabs} from "./redux/Actions/TabsActions";
import {loadRegisters} from "./redux/Actions/RegisterActions";

//      APP RELATED IMPORTS
import serverProxy from "./ServerProxy";
import AuthApp from "./AuthApp";
import LoginPage from "./components/Common_Components/LoginPage";
//////  STYLE IMPORTS
import './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';




function mapStateToProps(state) {
    return{
        tabs:state.tabs,
        plot:state.plot,
        modals:state.modals,
        scripts:state.scripts_store,
        settings:state.settings,
        peripherals:state.peripherals,
        applications:state.applications
    }
}

const mapDispatchToProps = dispatch => {
    return{
        setSettings: (setting) => {dispatch(setSetting(["application", setting]))},
        loadTabs: (tab) => {dispatch(loadTabs(tab))},
        loadRegisters: (peripheral, registers) => {dispatch(loadRegisters(peripheral,registers))},
    }
};


class App extends Component {

    constructor(props) {
        super(props);

        let server = new serverProxy('http://0.0.0.0:8989/uscope/', ''); //home: http://192.168.1.2/uscope/ unimore:http://155.185.48.185/uscope/ debug:http://0.0.0.0:8989/uscope/ unnc:http://10.190.0.74:4999/uscope/
        this.state = {logged:false, server:server};
        let token = JSON.parse(localStorage.getItem('login_token'));
        if(token){
            if (Date.now() > token.expiry){
                token.login_type = 'automated';
                this.done(token)
            } else {
                localStorage.removeItem('login_token');
            }
        }
        this.done = this.done.bind(this);
    }

    done(login_credentials){
        this.state.server.auth_proxy.sign_in(login_credentials).then((token) =>{
            let server = new serverProxy('http://0.0.0.0:8989/uscope/',token.access_token); //home: http://192.168.1.2/uscope/ unimore:http://155.185.48.185/uscope/ docker:http://172.18.0.1:4999/uscope/ unnc:http://10.190.0.74:4999/uscope/
            if(token.login_token){
                let ret = localStorage.setItem('login_token', JSON.stringify(token.login_token));
            }
            this.setState({logged:true, server:server});
        });

    }

    render() {
        return(
            <div className="App">
                {this.state.logged? <AuthApp server={this.state.server} />:<LoginPage server={this.state.server} done={this.done}/>}
            </div>
        )
    }


}

export default connect(mapStateToProps, mapDispatchToProps)(App);


