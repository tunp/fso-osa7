// @flow

import * as React from 'react';
import { Route } from 'react-router-dom'
import { Col, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import { msgShowing } from './reducers/notificationReducer'
import { userInit } from './reducers/userReducer'
import { blogInit } from './reducers/blogReducer'
import { loginInit, login } from './reducers/loginReducer'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Message from './components/Message'
import Togglable from './components/Togglable'
import UsersList from './components/UsersList'
import User from './components/User'
import Menu from './components/Menu'

type Props = {
    msgShowing: (msg?: string, type?: string) => void,
    userInit: () => void,
    blogInit: () => void,
    loginInit: () => void,
    login: ({ username: string, password: string }) => void,
    user?: { name?: string }
}

type EventType = {
    preventDefault: () => void,
    target: {
        username: { value: string },
        password: { value: string }
    }
}

class App extends React.Component<Props> {
    componentDidMount = async () => {
        this.props.msgShowing() // init
        await this.props.blogInit()
        await this.props.userInit()
        this.props.loginInit()
    }

    login = async (event: EventType) => {
        event.preventDefault()
        try {
            const login_user = {
                username: event.target.username.value,
                password: event.target.password.value
            }
            await this.props.login(login_user)
            this.props.msgShowing("Logged in as " + (this.props.user && this.props.user.name ? this.props.user.name : ""), "success")
        } catch (exception) {
            this.props.msgShowing("Error: " + exception, "fail")
        }
    }

    render() {
        let body;
        if (!this.props.user) {
            body = (
                <div>
                    <h2>Kirjaudu sovellukseen</h2>
                    <Form horizontal onSubmit={this.login}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>käyttäjätunnus</Col>
                            <Col sm={10}><FormControl name="username"/></Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>salasana</Col>
                            <Col sm={10}><FormControl type="password" name="password"/></Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button type="submit">kirjaudu</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            )
        } else {
            body = (
                <div className={"logged_in_container"}>
                    <Menu />
                    <Route exact path="/" className={"default_route"} render={() => (
                        <div>
                            <h2>blogs</h2>
                            <BlogList />
                            <Togglable className="add_blog_togglable" button_label={"Add Blog"}>
                                <BlogForm />
                            </Togglable>
                        </div>
                    )} />
                    <Route exact path="/users" render={() => <UsersList />} />
                    <Route exact path="/users/:id" render={({match}) => <User id={match.params.id} />} />
                    <Route exact path="/blogs/:id" render={
                        ({match, history}) => <Blog
                            id={match.params.id}
                            history={history}
                        />
                    } />
                </div>
            )
        }
        return (
            <div className="container">
                <Message />
                {body}
            </div>
        );
    }
}

App.propTypes = {
    msgShowing: PropTypes.func.isRequired,
    userInit: PropTypes.func.isRequired,
    blogInit: PropTypes.func.isRequired,
    loginInit: PropTypes.func.isRequired,
    login: PropTypes.func,
    user: PropTypes.object
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = {
    msgShowing,
    userInit,
    blogInit,
    loginInit,
    login
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default ConnectedApp
