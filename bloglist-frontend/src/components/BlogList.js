import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import PropTypes from 'prop-types'

class BlogList extends React.Component {
    render() {
        const blogs = this.props.blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <ListGroupItem key={blog._id}><Link to={`/blogs/${blog._id}`} className="blog_list_link" data-title={blog.title}>{blog.title} {blog.author}</Link></ListGroupItem>
        )
        return (
            <ListGroup className={"blog_list"}>
                {blogs}
            </ListGroup>
        )
    }
}

BlogList.propTypes = {
    blogs: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => {
    return {
        blogs: state.blogs.blogs
    }
}

const ConnectedBlogList = connect(mapStateToProps)(BlogList)

export default ConnectedBlogList

