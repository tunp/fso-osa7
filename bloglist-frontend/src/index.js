import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import store from './store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <Route path="/" component={App} />
            </Router>
        </Provider>,
        document.getElementById('root')
    )
}

render()
store.subscribe(render)
