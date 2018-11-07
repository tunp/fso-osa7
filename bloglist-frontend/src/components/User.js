import React from 'react'
import { connect } from 'react-redux'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import PropTypes from 'prop-types'

class User extends React.Component {
    getUserById(id) {
        if (this.props.users) {
            return this.props.users.find((u) => u._id === id)
        }
    }

    render() {
        const user = this.getUserById(this.props.id)
        const blogs = user.blogs.map((blog) => <ListGroupItem key={blog._id}>{blog.title} by {blog.author}</ListGroupItem>)
        return (
            <div>
                <h2>{user.name}</h2>
                <h3>Added blogs</h3>
                <ListGroup>
                    {blogs}
                </ListGroup>
            </div>
        )
    }
}

User.propTypes = {
    users: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
}

const ConnectedUser = connect(mapStateToProps)(User)

export default ConnectedUser
