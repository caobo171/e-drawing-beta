import React, { Component } from "react";
import { BrowserRouter as Router, Route ,HashRouter} from "react-router-dom";


import Login from "./components/auth/Login";
import Arena from './components/Arena';
import Global from './components/Global';
import Dashboard from './components/Dashboard';
import Profile from './components/Profiles';
import Practice from './components/practice/Practice';
import Ranking from './components/Ranking';
import TestBeta from './components/TestBeta'

import { Provider } from "react-redux";
import store from "./store";

import "./App.css";




class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
            <div className="App">
              <Route path="/" component ={Global}/>
              <Route path="/" exact component={Dashboard} />
              <Route path="/login" exact component={Login} />
              <Route path = "/arena" exact component = {Arena}/>
              <Route path = "/profile/:id" exact component = {Profile}/>
              <Route path="/testplay"exact component={TestBeta}/>
              <Route path = "/profile" exact component = {Profile}/>
              <Route path = "/practice" exact component = {Practice}/>
              <Route path = "/ranking" exact component = {Ranking}/>
            </div>
            
      
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
