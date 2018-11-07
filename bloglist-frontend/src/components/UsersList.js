import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import PropTypes from 'prop-types'

class UsersList extends React.Component {
    render() {
        const users = this.props.users ? this.props.users.map(user => (
            <tr key={user._id}>
                <td><Link to={`/users/${user._id}`}>{user.name}</Link></td>
                <td className={"user_blogs_count"}>{user.blogs.length}</td>
            </tr>
        )) : undefined
        return (
            <div>
                <h2>users</h2>
                <Table bordered>
                    <thead>
                        <tr><th></th><th>blogs added</th></tr>
                    </thead>
                    <tbody>
                        {users}
                    </tbody>
                </Table>
            </div>
        )
    }
}

UsersList.propTypes = {
    users: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
}

const ConnectedUsersList = connect(mapStateToProps)(UsersList)

export default ConnectedUsersList
