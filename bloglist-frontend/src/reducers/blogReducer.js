import blogService from '../services/blogs'

export const blogCreation = (content) => {
    return async (dispatch) => {
        const blog = await blogService.add(content)
        dispatch({
            type: 'CREATE_BLOG',
            blog
        })
    }
}

export const blogInit = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch({
            type: 'INIT_BLOGS',
            blogs
        })
    }
}

export const blogUpdating = (id, content) => {
    return async (dispatch) => {
        const updated_blog = await blogService.update(id, content)
        dispatch({
            type: 'UPDATE_BLOG',
            updated_blog,
            id
        })
    }
}

export const blogRemoving = (id) => {
    return async (dispatch) => {
        await blogService.remove(id)
        dispatch({
            type: 'REMOVE_BLOG',
            id
        })
    }
}

const reducer = (store = { blogs: [], token: undefined, last_changed_blog: undefined }, action) => {
    switch (action.type) {
        case 'CREATE_BLOG': return { ...store, blogs: [ ...store.blogs, action.blog ], last_changed_blog: action.blog }
        case 'INIT_BLOGS': return { ...store, blogs: action.blogs }
        case 'UPDATE_BLOG': return { ...store, blogs: store.blogs.map(blog => blog._id === action.id ? action.updated_blog : blog ), last_changed_blog: action.updated_blog }
        case 'REMOVE_BLOG': return { ...store, blogs: store.blogs.filter(blog => blog._id !== action.id) }
        default: return store
    }
}

export default reducer
