import React from 'react'
import { connect } from 'react-redux'
import { Col, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { msgShowing } from '../reducers/notificationReducer'
import { blogCreation } from '../reducers/blogReducer'
import { userUpdatingLocal } from '../reducers/userReducer'

class BlogForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            author: "",
            url: "",
        }
    }

    addBlog = async (event) => {
        event.preventDefault()
        try {
            await this.props.blogCreation({
                title: this.state.title,
                author: this.state.author,
                url: this.state.url
            })
            this.clear()
            const db_user = this.props.users.find(u => u._id === this.props.last_changed_blog.user._id)
            const new_user = { ...db_user, blogs: db_user.blogs.concat(this.props.last_changed_blog) }
            this.props.userUpdatingLocal(new_user)
            this.props.msgShowing("Added a new blog " + this.props.last_changed_blog.title, "success")
            this.props.parent.toggleVisibility()
        } catch (exception) {
            this.props.msgShowing("Error: " + exception, "fail")
        }
    }

    inputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    clear() {
        this.setState({ title: "", author: "", url: "" })
    }

    render() {
        return (
            <div>
                <Form horizontal onSubmit={this.addBlog}>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>title</Col>
                        <Col sm={10}><FormControl name="title" value={this.state.title} onChange={this.inputChange}/></Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>author</Col>
                        <Col sm={10}><FormControl name="author" value={this.state.author} onChange={this.inputChange}/></Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>url</Col>
                        <Col sm={10}><FormControl name="url" value={this.state.url} onChange={this.inputChange}/></Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button type="submit">create</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

BlogForm.propTypes = {
    msgShowing: PropTypes.func.isRequired,
    blogCreation: PropTypes.func.isRequired,
    userUpdatingLocal: PropTypes.func.isRequired,
    last_changed_blog: PropTypes.object,
    users: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => {
    return {
        last_changed_blog: state.blogs.last_changed_blog,
        users: state.users
    }
}

const mapDispatchToProps = {
    msgShowing,
    blogCreation,
    userUpdatingLocal
}

const ConnectedBlogForm = connect(mapStateToProps, mapDispatchToProps)(BlogForm)

export default ConnectedBlogForm
