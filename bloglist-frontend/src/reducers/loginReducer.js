import loginService from '../services/login'
import blogService from '../services/blogs'

export const login = (content) => {
    return async (dispatch) => {
        const user = await loginService.login(content)
        window.localStorage.setItem('blogsLoggedUser', JSON.stringify(user))
        blogService.setToken(user.token)
        dispatch({
            type: 'LOGIN',
            user
        })
    }
}

export const logout = () => {
    return (dispatch) => {
        window.localStorage.removeItem('blogsLoggedUser')
        blogService.setToken(undefined)
        dispatch({
            type: 'LOGOUT'
        })
    }
}

export const loginInit = () => {
    return (dispatch) => {
        const logged_user_json = window.localStorage.getItem('blogsLoggedUser')
        if (logged_user_json) {
            const user = JSON.parse(logged_user_json)
            blogService.setToken(user.token)
            dispatch({
                type: 'INIT_LOGIN',
                user
            })
        }
    }
}

const reducer = (store = null, action) => {
    switch (action.type) {
        case 'INIT_LOGIN': return action.user
        case 'LOGIN': return action.user
        case 'LOGOUT': return null
        default: return store
    }
}

export default reducer
