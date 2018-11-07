import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { NavLink, withRouter } from 'react-router-dom'
import { logout } from '../reducers/loginReducer'


class Menu extends React.Component {
    logout = (event) => {
        event.preventDefault()
        this.props.logout()
    }

    render() {
        const active_link_style = { backgroundColor: "#f22", padding: "2px", borderRadius: "4px" }
        return (
            <div style={{ backgroundColor: "#fbb", padding: "5px" }}>
                <NavLink activeStyle={active_link_style} exact to="/">blogs</NavLink>&nbsp;
                <NavLink activeStyle={active_link_style} className={"users_link"} to="/users">users</NavLink>&nbsp;
                {this.props.user.name} logged in&nbsp;<Button onClick={this.logout}>logout</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = {
    logout
}

// withRouter: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
const ConnectedMenu = withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu))

export default ConnectedMenu
