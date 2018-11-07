import React from 'react'
import { Button, Form, FormControl, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { blogUpdating, blogRemoving } from '../reducers/blogReducer'
import { msgShowing } from '../reducers/notificationReducer'
import commentService from '../services/comments'

export class Blog extends React.Component {
    addComment = async (event) => {
        event.preventDefault()
        try {
            const blog_id = event.target.getAttribute("data-blog_id")
            const comment = { text: event.target.text.value }
            event.target.text.value = ''
            const new_comment = await commentService.add(blog_id, comment)
            const blog = this.props.blogs.find(blog => blog._id.toString() === blog_id)
            const comments = blog.comments.concat(new_comment)
            await this.props.blogUpdating(blog_id, {
                ...blog,
                comments,
            })
            this.props.msgShowing("Added a new comment " + new_comment.text, "success")
        } catch (exception) {
            this.props.msgShowing("Error: " + exception, "fail")
        }
    }

    likeBlog = async (event) => {
        // shallow test doesnt seem to get event
        if (event) {
            event.preventDefault()
        }
        try {
            const blog = this.getBlogById(this.props.id)
            await this.props.blogUpdating(this.props.id, {
                ...blog,
                likes: blog.likes + 1,
            })
            this.props.msgShowing("Liked a blog " + this.props.last_changed_blog.title, "success")
        } catch (exception) {
            this.props.msgShowing("Error: " + exception, "fail")
        }
    }

    removeBlog = (history) => async (event) => {
        event.preventDefault()
        const id = event.target.attributes["data-id"].value;
        const blog = this.props.blogs.find(b => b._id === id)
        if (window.confirm("Delele blog " + blog.title + " by " + blog.author + "?")) {
            try {
                await this.props.blogRemoving(id)
                this.props.msgShowing("Blog " + blog.title + " removed", "success")
                history.push('/')
            } catch (exception) {
                this.props.msgShowing("Error: " + exception, "fail")
            }
        }
    }

    getBlogById(id) {
        if (this.props.blogs) {
            return this.props.blogs.find((b) => b._id === id)
        }
    }

    render() {
        const blog = this.getBlogById(this.props.id)
        if (blog) {
            const delete_button = (!blog.user || blog.user._id === this.props.user.id) && (<div><Button className={"delete_button"} onClick={this.removeBlog(this.props.history)} data-id={blog._id}>Delete</Button></div>)
            const comments = blog.comments.map(comment => (<li key={comment._id} className={"comment"}>{comment.text}</li>))
            return (
                <div>
                    <div onClick={this.toggleVisibility} className="title_author">
                        <h2>{blog.title} {blog.author}</h2>
                    </div>
                    <div>
                        <div>
                            <a href={blog.url}>{blog.url}</a>
                        </div>
                        <div>
                            <span className="likes">{blog.likes} likes</span> <Button className={"liking"} onClick={this.likeBlog} data-id={blog._id}>like</Button>
                        </div>
                        <div>Added by {blog.user.name}</div>
                        {delete_button}
                    </div>
                    <div>
                        <h2>comments</h2>
                        <ul className={"comments"}>
                            {comments}
                        </ul>
                        <Form horizontal onSubmit={this.addComment} data-blog_id={blog._id}>
                            <Col sm={10}>
                            <FormControl name="text" className={"comment_input"} />
                            </Col>
                            <Col sm={2}>
                            <Button type="submit" className={"add_comment_button"}>add comment</Button>
                            </Col>
                        </Form>
                    </div>
                </div>
            )
        }
        return null
    }
}

Blog.propTypes = {
    msgShowing: PropTypes.func.isRequired,
    blogUpdating: PropTypes.func.isRequired,
    blogRemoving: PropTypes.func.isRequired,
    blogs: PropTypes.array.isRequired,
    last_changed_blog: PropTypes.object,
    user: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
    return {
        blogs: state.blogs.blogs,
        last_changed_blog: state.blogs.last_changed_blog,
        user: state.user
    }
}

const mapDispatchToProps = {
    msgShowing,
    blogUpdating,
    blogRemoving
}

const ConnectedBlog = connect(mapStateToProps, mapDispatchToProps)(Blog)

export default ConnectedBlog
