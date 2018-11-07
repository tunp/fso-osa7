// @flow

import userService from '../services/users'

type UserType = {
    _id: string
}

type ActionType = {
    type: string,
    user?: UserType,
    users?: Array<UserType>
}

export const userCreation = (content: UserType) => {
    return async (dispatch: (ActionType) => void) => {
        const user = await userService.createNew(content)
        dispatch({
            type: 'CREATE_USER',
            user
        })
    }
}

export const userUpdatingLocal = (content: UserType) => {
    return (dispatch: (ActionType) => void) => {
        dispatch({
            type: 'UPDATE_USER',
            user: content
        })
    }
}

export const userInit = () => {
    return async (dispatch: (ActionType) => void) => {
        const users = await userService.getAll()
        dispatch({
            type: 'INIT_USERS',
            users
        })
    }
}

const reducer = (store: Array<UserType> = [], action: ActionType ) => {
    switch (action.type) {
        case 'CREATE_USER': return [ ...store, action.user ]
        case 'UPDATE_USER': 
            // should be store.map<UserType> but doesnt seem to work?
            return store.map((u: UserType) => action.user && u._id === action.user._id ? action.user : u)
        case 'INIT_USERS': return action.users
        default: return store
    }
}

export default reducer
