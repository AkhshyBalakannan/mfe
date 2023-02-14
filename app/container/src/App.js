import React from 'react';
import ReactApp from './components/ReactApp';
import { Route, Switch, Router, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import VueApp from './components/VueApp';
import '../assets/app.css'

const history = createBrowserHistory();

const Header = () => (
    <div className='navbar'>
        <Link to='/'>home</Link>
        <Link to='/react'>Goto React Component</Link>
        <Link to='/vue'>Goto Vue Component</Link>
    </div >
)

export default () => {
    return (
        <Router history={history}>
            <Header />
            <body className='body-content'>
                <Switch>
                    <Route path='/vue' component={VueApp} />
                    <Route path='/' component={ReactApp} />
                </Switch>
            </body>
        </Router>
    )
}
